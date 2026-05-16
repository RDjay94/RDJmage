import Combine
import CoreMotion
import Foundation

/// Reads device attitude and produces cursor deltas based on tilt.
/// Pitch (rotating phone forward/back) drives Y; roll drives X.
/// The deltas are conservative; tune `sensitivity` and `deadZone`
/// to taste — values here feel reasonable on iPhone 14/15.
final class MotionManager: ObservableObject {
    @Published var isActive: Bool = false {
        didSet { isActive ? start() : stop() }
    }

    var onDelta: ((Int16, Int16) -> Void)?

    private let motion = CMMotionManager()
    private let queue = OperationQueue()
    private let sensitivity: Double = 18.0
    private let deadZone: Double = 0.03

    init() {
        queue.qualityOfService = .userInteractive
        motion.deviceMotionUpdateInterval = 1.0 / 60.0
    }

    private func start() {
        guard motion.isDeviceMotionAvailable else { return }
        motion.startDeviceMotionUpdates(to: queue) { [weak self] data, _ in
            guard let self, let data else { return }
            let roll = data.attitude.roll
            let pitch = data.attitude.pitch - .pi / 4 // hold phone tilted ~45°
            let rx = abs(roll) < self.deadZone ? 0 : roll
            let py = abs(pitch) < self.deadZone ? 0 : pitch
            let dx = Int16(clamping: Int(rx * self.sensitivity))
            let dy = Int16(clamping: Int(py * self.sensitivity))
            if dx != 0 || dy != 0 {
                self.onDelta?(dx, dy)
            }
        }
    }

    private func stop() {
        motion.stopDeviceMotionUpdates()
    }
}
