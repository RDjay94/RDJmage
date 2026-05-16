import CoreBluetooth
import Foundation

/// Advertises a custom GATT service so the Mac host app can discover the
/// phone and receive input packets. All writes from this side are sent
/// via characteristic notifications/indications, since iOS-as-peripheral
/// cannot be written-to by a central without subscription anyway.
final class BLEPeripheralService: NSObject, ObservableObject {
    enum State: String {
        case off, unauthorized, unsupported, ready, advertising, connected
    }

    @Published private(set) var state: State = .off
    @Published private(set) var subscribedCentral: CBCentral?

    private var manager: CBPeripheralManager!
    private var inputCharacteristic: CBMutableCharacteristic!
    private let queue = DispatchQueue(label: "henrysgamingmouse.ble.peripheral", qos: .userInteractive)

    override init() {
        super.init()
        manager = CBPeripheralManager(delegate: self, queue: queue, options: [
            CBPeripheralManagerOptionShowPowerAlertKey: true
        ])
    }

    func send(_ packet: Data) {
        guard state == .connected, let char = inputCharacteristic else { return }
        manager.updateValue(packet, for: char, onSubscribedCentrals: nil)
    }

    private func configureService() {
        inputCharacteristic = CBMutableCharacteristic(
            type: HenrysGamingMouseBLE.inputCharacteristicUUID,
            properties: [.notify, .read],
            value: nil,
            permissions: [.readable]
        )
        let service = CBMutableService(type: HenrysGamingMouseBLE.serviceUUID, primary: true)
        service.characteristics = [inputCharacteristic]
        manager.add(service)
    }

    private func startAdvertising() {
        guard manager.state == .poweredOn else { return }
        manager.startAdvertising([
            CBAdvertisementDataServiceUUIDsKey: [HenrysGamingMouseBLE.serviceUUID],
            CBAdvertisementDataLocalNameKey: "Henry's Gaming Mouse"
        ])
        DispatchQueue.main.async { self.state = .advertising }
    }
}

extension BLEPeripheralService: CBPeripheralManagerDelegate {
    func peripheralManagerDidUpdateState(_ peripheral: CBPeripheralManager) {
        DispatchQueue.main.async {
            switch peripheral.state {
            case .poweredOn: self.state = .ready
            case .unauthorized: self.state = .unauthorized
            case .unsupported: self.state = .unsupported
            default: self.state = .off
            }
        }
        if peripheral.state == .poweredOn {
            configureService()
        }
    }

    func peripheralManager(_ peripheral: CBPeripheralManager, didAdd service: CBService, error: Error?) {
        startAdvertising()
    }

    func peripheralManager(_ peripheral: CBPeripheralManager, central: CBCentral, didSubscribeTo characteristic: CBCharacteristic) {
        DispatchQueue.main.async {
            self.subscribedCentral = central
            self.state = .connected
        }
    }

    func peripheralManager(_ peripheral: CBPeripheralManager, central: CBCentral, didUnsubscribeFrom characteristic: CBCharacteristic) {
        DispatchQueue.main.async {
            self.subscribedCentral = nil
            self.state = .advertising
        }
    }
}
