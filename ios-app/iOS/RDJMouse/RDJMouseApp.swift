import SwiftUI

@main
struct RDJMouseApp: App {
    @StateObject private var peripheral = BLEPeripheralService()
    @StateObject private var motion = MotionManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(peripheral)
                .environmentObject(motion)
                .preferredColorScheme(.dark)
        }
    }
}
