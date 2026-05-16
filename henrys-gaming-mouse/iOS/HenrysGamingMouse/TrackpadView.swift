import SwiftUI

struct TrackpadView: View {
    let onMove: (Int16, Int16) -> Void
    let onLeftDown: () -> Void
    let onLeftUp: () -> Void
    let onRightClick: () -> Void
    let onScroll: (Int16, Int16) -> Void

    @State private var lastSingle: CGPoint?
    @State private var lastDouble: CGPoint?
    @State private var didMoveSingle = false
    @State private var singleStart: Date?

    private let tapMaxDuration: TimeInterval = 0.18
    private let tapMaxDrift: CGFloat = 6
    // Single-finger drag scales 1:1; two-finger drag treated as scroll.
    private let moveScale: Double = 1.4
    private let scrollScale: Double = 0.15

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 24, style: .continuous)
                .fill(Color.white.opacity(0.04))
                .overlay(
                    RoundedRectangle(cornerRadius: 24, style: .continuous)
                        .stroke(Color.white.opacity(0.12), lineWidth: 1)
                )
            Text("Drag to move · Tap to click · Two-finger drag to scroll · Long-press for right-click")
                .font(.footnote)
                .foregroundStyle(.secondary)
                .multilineTextAlignment(.center)
                .padding(.horizontal, 24)
        }
        .contentShape(Rectangle())
        .gesture(singleFingerDrag)
        .simultaneousGesture(twoFingerScroll)
        .simultaneousGesture(rightClickPress)
    }

    private var singleFingerDrag: some Gesture {
        DragGesture(minimumDistance: 0)
            .onChanged { value in
                defer { lastSingle = value.location }
                if singleStart == nil {
                    singleStart = Date()
                    didMoveSingle = false
                    return
                }
                guard let prev = lastSingle else { return }
                let dxF = (value.location.x - prev.x) * moveScale
                let dyF = (value.location.y - prev.y) * moveScale
                let dx = Int16(clamping: Int(dxF))
                let dy = Int16(clamping: Int(dyF))
                if abs(value.translation.width) > tapMaxDrift || abs(value.translation.height) > tapMaxDrift {
                    didMoveSingle = true
                }
                if dx != 0 || dy != 0 {
                    onMove(dx, dy)
                }
            }
            .onEnded { _ in
                defer {
                    singleStart = nil
                    lastSingle = nil
                    didMoveSingle = false
                }
                if let start = singleStart, !didMoveSingle, Date().timeIntervalSince(start) < tapMaxDuration {
                    onLeftDown()
                    DispatchQueue.main.asyncAfter(deadline: .now() + 0.04) { onLeftUp() }
                }
            }
    }

    private var twoFingerScroll: some Gesture {
        // SwiftUI doesn't expose touch count directly; we approximate
        // two-finger scroll by reading a magnification gesture's modifier.
        // For a real iPad/iPhone experience, replace this with a
        // UIPanGestureRecognizer wrapped via UIViewRepresentable that
        // sets minimumNumberOfTouches = 2.
        DragGesture(minimumDistance: 10)
            .onChanged { value in
                defer { lastDouble = value.location }
                guard let prev = lastDouble else { return }
                let dyF = (value.location.y - prev.y) * scrollScale
                let dxF = (value.location.x - prev.x) * scrollScale
                let dx = Int16(clamping: Int(dxF))
                let dy = Int16(clamping: Int(dyF))
                if dx != 0 || dy != 0 {
                    onScroll(dx, dy)
                }
            }
            .onEnded { _ in lastDouble = nil }
    }

    private var rightClickPress: some Gesture {
        LongPressGesture(minimumDuration: 0.45)
            .onEnded { _ in onRightClick() }
    }
}
