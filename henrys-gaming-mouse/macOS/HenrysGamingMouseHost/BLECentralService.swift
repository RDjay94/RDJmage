import CoreBluetooth
import Foundation

final class BLECentralService: NSObject, ObservableObject {
    @Published private(set) var statusText: String = "Starting…"
    @Published private(set) var isConnected: Bool = false
    @Published private(set) var discovered: [String] = []

    private var manager: CBCentralManager!
    private var phone: CBPeripheral?
    private let cursor = CursorController()
    private let queue = DispatchQueue(label: "henrysgamingmouse.ble.central", qos: .userInteractive)

    override init() {
        super.init()
        manager = CBCentralManager(delegate: self, queue: queue, options: [
            CBCentralManagerOptionShowPowerAlertKey: true
        ])
    }

    func disconnect() {
        if let phone {
            manager.cancelPeripheralConnection(phone)
        }
    }

    func rescan() {
        guard manager.state == .poweredOn else { return }
        manager.stopScan()
        DispatchQueue.main.async { self.discovered = [] }
        manager.scanForPeripherals(withServices: [HenrysGamingMouseBLE.serviceUUID], options: [
            CBCentralManagerScanOptionAllowDuplicatesKey: false
        ])
        DispatchQueue.main.async { self.statusText = "Scanning…" }
    }
}

extension BLECentralService: CBCentralManagerDelegate {
    func centralManagerDidUpdateState(_ central: CBCentralManager) {
        DispatchQueue.main.async {
            switch central.state {
            case .poweredOn:
                self.statusText = "Scanning…"
            case .unauthorized:
                self.statusText = "Bluetooth permission denied"
            case .poweredOff:
                self.statusText = "Bluetooth off"
            default:
                self.statusText = "Bluetooth unavailable"
            }
        }
        if central.state == .poweredOn {
            central.scanForPeripherals(withServices: [HenrysGamingMouseBLE.serviceUUID], options: nil)
        }
    }

    func centralManager(_ central: CBCentralManager, didDiscover peripheral: CBPeripheral, advertisementData: [String: Any], rssi RSSI: NSNumber) {
        let name = peripheral.name ?? advertisementData[CBAdvertisementDataLocalNameKey] as? String ?? "Unknown"
        DispatchQueue.main.async {
            if !self.discovered.contains(name) { self.discovered.append(name) }
        }
        phone = peripheral
        peripheral.delegate = self
        central.stopScan()
        central.connect(peripheral, options: nil)
        DispatchQueue.main.async { self.statusText = "Connecting to \(name)…" }
    }

    func centralManager(_ central: CBCentralManager, didConnect peripheral: CBPeripheral) {
        DispatchQueue.main.async {
            self.isConnected = true
            self.statusText = "Connected to \(peripheral.name ?? "phone")"
        }
        peripheral.discoverServices([HenrysGamingMouseBLE.serviceUUID])
    }

    func centralManager(_ central: CBCentralManager, didDisconnectPeripheral peripheral: CBPeripheral, error: Error?) {
        DispatchQueue.main.async {
            self.isConnected = false
            self.statusText = "Disconnected — scanning…"
        }
        central.scanForPeripherals(withServices: [HenrysGamingMouseBLE.serviceUUID], options: nil)
    }
}

extension BLECentralService: CBPeripheralDelegate {
    func peripheral(_ peripheral: CBPeripheral, didDiscoverServices error: Error?) {
        guard let service = peripheral.services?.first(where: { $0.uuid == HenrysGamingMouseBLE.serviceUUID }) else { return }
        peripheral.discoverCharacteristics([HenrysGamingMouseBLE.inputCharacteristicUUID], for: service)
    }

    func peripheral(_ peripheral: CBPeripheral, didDiscoverCharacteristicsFor service: CBService, error: Error?) {
        guard let char = service.characteristics?.first(where: { $0.uuid == HenrysGamingMouseBLE.inputCharacteristicUUID }) else { return }
        peripheral.setNotifyValue(true, for: char)
    }

    func peripheral(_ peripheral: CBPeripheral, didUpdateValueFor characteristic: CBCharacteristic, error: Error?) {
        guard let data = characteristic.value, let packet = HenrysGamingMouseBLE.decode(data) else { return }
        cursor.handle(packet)
    }
}
