import SwiftUI

@main
struct RDJMouseHostApp: App {
    @StateObject private var central = BLECentralService()

    var body: some Scene {
        MenuBarExtra("RDJMouse", systemImage: central.isConnected ? "cursorarrow.click.2" : "cursorarrow") {
            StatusView()
                .environmentObject(central)
        }
        .menuBarExtraStyle(.window)
    }
}
