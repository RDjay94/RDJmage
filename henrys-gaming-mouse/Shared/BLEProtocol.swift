import CoreBluetooth
import Foundation

/// Shared BLE protocol between Henry's Gaming Mouse (iOS peripheral) and
/// Henry's Gaming Mouse Host (macOS central). Both apps must use these
/// UUIDs and the same packet layout. iOS cannot advertise the standard
/// HID-over-GATT profile (0x1812 is reserved by Apple), so we expose a
/// custom service and translate to OS-level events on the Mac side via
/// CGEvent.
public enum HenrysGamingMouseBLE {
    /// Custom GATT service the iOS app advertises and the Mac scans for.
    public static let serviceUUID = CBUUID(string: "F1B5A2C0-1E3A-4D8E-9B6C-7A0E5C9D1F23")

    /// Single write-without-response characteristic carrying 8-byte input packets.
    public static let inputCharacteristicUUID = CBUUID(string: "F1B5A2C1-1E3A-4D8E-9B6C-7A0E5C9D1F23")

    /// Packet types (byte 0 of every packet).
    public enum EventType: UInt8 {
        case move = 0      // dx, dy in signed int16 device pixels per frame
        case leftDown = 1
        case leftUp = 2
        case rightDown = 3
        case rightUp = 4
        case scroll = 5    // dx, dy = scroll deltas (lines, signed)
        case doubleTap = 6
    }

    /// Fixed 8-byte little-endian packet:
    ///   [0]    type:u8
    ///   [1..2] dx:i16
    ///   [3..4] dy:i16
    ///   [5]    buttons bitmask (bit0=left, bit1=right)
    ///   [6..7] reserved
    public static let packetSize = 8

    public static func encode(type: EventType, dx: Int16 = 0, dy: Int16 = 0, buttons: UInt8 = 0) -> Data {
        var bytes = [UInt8](repeating: 0, count: packetSize)
        bytes[0] = type.rawValue
        let udx = UInt16(bitPattern: dx)
        let udy = UInt16(bitPattern: dy)
        bytes[1] = UInt8(udx & 0xFF)
        bytes[2] = UInt8(udx >> 8)
        bytes[3] = UInt8(udy & 0xFF)
        bytes[4] = UInt8(udy >> 8)
        bytes[5] = buttons
        return Data(bytes)
    }

    public struct Packet {
        public let type: EventType
        public let dx: Int16
        public let dy: Int16
        public let buttons: UInt8
    }

    public static func decode(_ data: Data) -> Packet? {
        guard data.count >= packetSize, let type = EventType(rawValue: data[0]) else { return nil }
        let dx = Int16(bitPattern: UInt16(data[1]) | (UInt16(data[2]) << 8))
        let dy = Int16(bitPattern: UInt16(data[3]) | (UInt16(data[4]) << 8))
        return Packet(type: type, dx: dx, dy: dy, buttons: data[5])
    }
}
