import AppKit
import CoreGraphics

/// Translates decoded BLE packets into synthesized cursor events.
/// Requires the host app to be granted *Accessibility* permission
/// (System Settings → Privacy & Security → Accessibility). Without
/// that, `CGEvent.post` is silently dropped.
final class CursorController {
    private var leftDown = false
    private var rightDown = false

    func handle(_ packet: HenrysGamingMouseBLE.Packet) {
        switch packet.type {
        case .move:
            move(dx: CGFloat(packet.dx), dy: CGFloat(packet.dy))
        case .leftDown:
            leftDown = true
            postButton(.leftMouseDown, button: .left)
        case .leftUp:
            leftDown = false
            postButton(.leftMouseUp, button: .left)
        case .rightDown:
            rightDown = true
            postButton(.rightMouseDown, button: .right)
        case .rightUp:
            rightDown = false
            postButton(.rightMouseUp, button: .right)
        case .scroll:
            scroll(dx: Int32(packet.dx), dy: Int32(packet.dy))
        case .doubleTap:
            click(button: .left, count: 2)
        }
    }

    private func currentLocation() -> CGPoint {
        CGEvent(source: nil)?.location ?? .zero
    }

    private func move(dx: CGFloat, dy: CGFloat) {
        guard let screen = NSScreen.main else { return }
        let p = currentLocation()
        var nx = p.x + dx
        var ny = p.y + dy
        let f = screen.frame
        nx = min(max(nx, f.minX), f.maxX - 1)
        ny = min(max(ny, f.minY), f.maxY - 1)
        let eventType: CGEventType = leftDown ? .leftMouseDragged : (rightDown ? .rightMouseDragged : .mouseMoved)
        let button: CGMouseButton = leftDown ? .left : (rightDown ? .right : .left)
        let event = CGEvent(mouseEventSource: nil, mouseType: eventType, mouseCursorPosition: CGPoint(x: nx, y: ny), mouseButton: button)
        event?.post(tap: .cghidEventTap)
    }

    private func postButton(_ type: CGEventType, button: CGMouseButton) {
        let p = currentLocation()
        let event = CGEvent(mouseEventSource: nil, mouseType: type, mouseCursorPosition: p, mouseButton: button)
        event?.post(tap: .cghidEventTap)
    }

    private func click(button: CGMouseButton, count: Int) {
        let p = currentLocation()
        let down: CGEventType = button == .left ? .leftMouseDown : .rightMouseDown
        let up: CGEventType = button == .left ? .leftMouseUp : .rightMouseUp
        let evDown = CGEvent(mouseEventSource: nil, mouseType: down, mouseCursorPosition: p, mouseButton: button)
        let evUp = CGEvent(mouseEventSource: nil, mouseType: up, mouseCursorPosition: p, mouseButton: button)
        evDown?.setIntegerValueField(.mouseEventClickState, value: Int64(count))
        evUp?.setIntegerValueField(.mouseEventClickState, value: Int64(count))
        evDown?.post(tap: .cghidEventTap)
        evUp?.post(tap: .cghidEventTap)
    }

    private func scroll(dx: Int32, dy: Int32) {
        let event = CGEvent(scrollWheelEvent2Source: nil, units: .line, wheelCount: 2, wheel1: -dy, wheel2: dx, wheel3: 0)
        event?.post(tap: .cghidEventTap)
    }
}
