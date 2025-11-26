package com.health.util;

import lombok.extern.java.Log;

import java.net.NetworkInterface;
import java.util.logging.Level;

@Log
public class NetworkUtils {

    public static String getLocalIpAddress() {
        try {
            var interfaces = NetworkInterface.getNetworkInterfaces();

            while (interfaces.hasMoreElements()) {
                NetworkInterface iface = interfaces.nextElement();

                // Bỏ qua loopback, virtual, docker, VM...
                if (!iface.isUp() || iface.isLoopback() || iface.isVirtual())
                    continue;

                var addresses = iface.getInetAddresses();
                while (addresses.hasMoreElements()) {
                    var addr = addresses.nextElement();

                    // Lấy IPv4
                    if (addr instanceof java.net.Inet4Address && !addr.isLoopbackAddress()) {
                        return addr.getHostAddress();
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "127.0.0.1";
    }
}

