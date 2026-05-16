import SwiftUI

@main
struct HenrysGamingMouseHostApp: App {
    @StateObject private var central = BLECentralService()

    var body: some Scene {
        MenuBarExtra("Henry's Gaming Mouse", systemImage: central.isConnected ? "cursorarrow.click.2" : "cursorarrow") {
            StatusView()
                .environmentObject(central)
        }
        .menuBarExtraStyle(.window)
    }
}
