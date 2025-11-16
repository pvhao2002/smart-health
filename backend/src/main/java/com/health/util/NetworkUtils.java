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

                String name = iface.getDisplayName().toLowerCase();

                if (
                        !iface.isUp() ||
                                iface.isLoopback() ||
                                iface.isVirtual() ||
                                !(name.contains("wi-fi") || name.contains("wlan") || name.contains("wireless"))
                ) continue;

                var addresses = iface.getInetAddresses();
                while (addresses.hasMoreElements()) {
                    var addr = addresses.nextElement();

                    if (!addr.isLoopbackAddress() && addr.isSiteLocalAddress()) {
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

