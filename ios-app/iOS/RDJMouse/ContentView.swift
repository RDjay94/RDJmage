import SwiftUI

struct ContentView: View {
    @EnvironmentObject var peripheral: BLEPeripheralService
    @EnvironmentObject var motion: MotionManager

    var body: some View {
        VStack(spacing: 16) {
            header
            TrackpadView(
                onMove: { dx, dy in send(.move, dx: dx, dy: dy) },
                onLeftDown: { send(.leftDown) },
                onLeftUp: { send(.leftUp) },
                onRightClick: {
                    send(.rightDown)
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.04) { send(.rightUp) }
                },
                onScroll: { dx, dy in send(.scroll, dx: dx, dy: dy) }
            )
            .frame(maxWidth: .infinity, maxHeight: .infinity)

            bottomControls
        }
        .padding(20)
        .background(Color.black.ignoresSafeArea())
        .onAppear { wireMotion() }
    }

    private var header: some View {
        HStack {
            Circle()
                .fill(statusColor)
                .frame(width: 10, height: 10)
            Text(statusLabel)
                .font(.headline)
                .foregroundStyle(.white)
            Spacer()
            Text("RDJMouse")
                .font(.system(.title3, design: .rounded).weight(.semibold))
                .foregroundStyle(.white)
        }
    }

    private var bottomControls: some View {
        HStack(spacing: 12) {
            mouseButton(label: "Left", action: {
                send(.leftDown)
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.04) { send(.leftUp) }
            })
            mouseButton(label: "Right", action: {
                send(.rightDown)
                DispatchQueue.main.asyncAfter(deadline: .now() + 0.04) { send(.rightUp) }
            })
            Toggle(isOn: $motion.isActive) {
                Text("Tilt")
                    .font(.subheadline.weight(.medium))
                    .foregroundStyle(.white)
            }
            .tint(.green)
            .padding(.horizontal, 14)
            .padding(.vertical, 10)
            .background(Color.white.opacity(0.06))
            .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
        }
    }

    private func mouseButton(label: String, action: @escaping () -> Void) -> some View {
        Button(action: action) {
            Text(label)
                .font(.subheadline.weight(.semibold))
                .foregroundStyle(.white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 14)
                .background(Color.white.opacity(0.08))
                .clipShape(RoundedRectangle(cornerRadius: 14, style: .continuous))
        }
    }

    private var statusColor: Color {
        switch peripheral.state {
        case .connected: return .green
        case .advertising, .ready: return .yellow
        default: return .red
        }
    }

    private var statusLabel: String {
        switch peripheral.state {
        case .connected: return "Connected"
        case .advertising: return "Looking for Mac…"
        case .ready: return "Bluetooth ready"
        case .unauthorized: return "Bluetooth permission needed"
        case .unsupported: return "Bluetooth not supported"
        case .off: return "Bluetooth off"
        }
    }

    private func wireMotion() {
        motion.onDelta = { [weak peripheral] dx, dy in
            guard let peripheral else { return }
            peripheral.send(RDJMouseBLE.encode(type: .move, dx: dx, dy: dy))
        }
    }

    private func send(_ type: RDJMouseBLE.EventType, dx: Int16 = 0, dy: Int16 = 0) {
        peripheral.send(RDJMouseBLE.encode(type: type, dx: dx, dy: dy))
    }
}
