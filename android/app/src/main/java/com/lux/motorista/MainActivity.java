package com.lux.motorista;

import android.os.Bundle;
import android.util.Log;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    public void onCreate(Bundle savedInstanceState) {
        // CRÍTICO: registerPlugin DEVE vir ANTES do super.onCreate()
        // No Capacitor 3+, a bridge é inicializada dentro do super.onCreate().
        // Se o plugin for registrado depois, ele não estará disponível para o WebApp.
        try {
            registerPlugin(LuxDriverPlugin.class);
            Log.e("LUX_DEBUG", "✅ PLUGIN: LuxDriverPlugin registrado ANTES da bridge!");
        } catch (Exception e) {
            Log.e("LUX_DEBUG", "❌ ERRO PLUGIN: " + e.getMessage());
        }

        super.onCreate(savedInstanceState);
    }
}
