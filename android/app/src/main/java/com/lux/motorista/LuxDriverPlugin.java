package com.lux.motorista;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Build;
import android.provider.Settings;
import android.util.Log;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

@CapacitorPlugin(name = "LuxDriver")
public class LuxDriverPlugin extends Plugin {

    private static final String TAG = "LUX_PLUGIN";

    @PluginMethod
    public void checkAccessibilityPermission(PluginCall call) {
        boolean isEnabled = checkAccessibility(getContext());
        JSObject ret = new JSObject();
        ret.put("value", isEnabled);
        Log.d(TAG, "Accessibility check result: " + isEnabled);
        call.resolve(ret);
    }

    @PluginMethod
    public void openAccessibilitySettings(PluginCall call) {
        try {
            Log.d(TAG, "Opening accessibility settings...");

            // Tenta abrir direto no serviço Lux (funciona em Android 9+)
            boolean opened = false;
            try {
                Intent directIntent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
                android.os.Bundle args = new android.os.Bundle();
                String componentName = getContext().getPackageName()
                        + "/" + getContext().getPackageName() + ".RideService";
                args.putString(":settings:fragment_args_key", componentName);
                directIntent.putExtra(":settings:show_fragment_args", args);
                directIntent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                if (directIntent.resolveActivity(getContext().getPackageManager()) != null) {
                    getContext().startActivity(directIntent);
                    opened = true;
                    Log.d(TAG, "Opened direct accessibility settings for: " + componentName);
                }
            } catch (Exception ex) {
                Log.w(TAG, "Direct accessibility intent failed, falling back: " + ex.getMessage());
            }

            // Fallback: abre a tela geral de Acessibilidade
            if (!opened) {
                Intent intent = new Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS);
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                getContext().startActivity(intent);
                Log.d(TAG, "Opened general accessibility settings");
            }

            new android.os.Handler(android.os.Looper.getMainLooper()).postDelayed(() -> {
                call.resolve();
            }, 500);

        } catch (Exception e) {
            Log.e(TAG, "Error opening accessibility settings: " + e.getMessage());
            call.reject("Erro: " + e.getMessage());
        }
    }

    @PluginMethod
    public void checkOverlayPermission(PluginCall call) {
        boolean canDraw = false;
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                canDraw = Settings.canDrawOverlays(getContext());
            } else {
                canDraw = true;
            }
        } catch (Exception e) {
            Log.e(TAG, "Error checking overlay: " + e.getMessage());
        }
        Log.d(TAG, "Overlay check result: " + canDraw);
        JSObject ret = new JSObject();
        ret.put("value", canDraw);
        call.resolve(ret);
    }

    @PluginMethod
    public void openOverlaySettings(PluginCall call) {
        try {
            Log.d(TAG, "Opening overlay settings...");

            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                Intent intent = new Intent(
                    Settings.ACTION_MANAGE_OVERLAY_PERMISSION,
                    Uri.parse("package:" + getContext().getPackageName())
                );
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);

                if (intent.resolveActivity(getContext().getPackageManager()) != null) {
                    getContext().startActivity(intent);
                } else {
                    Intent fallback = new Intent(Settings.ACTION_APPLICATION_DETAILS_SETTINGS);
                    fallback.setData(Uri.parse("package:" + getContext().getPackageName()));
                    fallback.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    getContext().startActivity(fallback);
                }
            }

            call.resolve();

        } catch (Exception e) {
            Log.e(TAG, "Error: " + e.getMessage());
            call.reject("Erro: " + e.getMessage());
        }
    }

    @PluginMethod
    public void saveVehicleConfig(PluginCall call) {
        try {
            double fuelPrice = call.getDouble("fuelPrice", 5.89);
            double consumptionPerKm = call.getDouble("consumptionPerKm", 10.0);
            double consumptionPerHour = call.getDouble("consumptionPerHour", 1.5);
            double maintenanceCostPerKm = call.getDouble("maintenanceCostPerKm", 0.20);
            String primaryMetric = call.getString("primaryMetric", "profitPerHour");
            int overlayDurationSec = call.getInt("overlayDuration", 10);
            long overlayDurationMs = overlayDurationSec * 1000L;

            // Converte o array de métricas visíveis para string separada por vírgula
            String visibleMetrics = "profitPerHour,netProfit";
            try {
                com.getcapacitor.JSArray arr = call.getArray("visibleMetrics");
                if (arr != null && arr.length() > 0) {
                    StringBuilder sb = new StringBuilder();
                    for (int i = 0; i < arr.length(); i++) {
                        if (i > 0) sb.append(",");
                        sb.append(arr.getString(i));
                    }
                    visibleMetrics = sb.toString();
                }
            } catch (Exception ex) {
                Log.w(TAG, "Could not parse visibleMetrics: " + ex.getMessage());
            }

            double thresholdYellow = call.getDouble("thresholdYellow", 0.20);
            double thresholdGreen  = call.getDouble("thresholdGreen",  0.50);

            SharedPreferences prefs = getContext().getSharedPreferences("lux_driver_prefs", Context.MODE_PRIVATE);
            prefs.edit()
                .putFloat("fuel_price", (float) fuelPrice)
                .putFloat("consumption_per_km", (float) consumptionPerKm)
                .putFloat("consumption_per_hour", (float) consumptionPerHour)
                .putFloat("maintenance_cost_per_km", (float) maintenanceCostPerKm)
                .putString("primary_metric", primaryMetric)
                .putLong("overlay_duration", overlayDurationMs)
                .putString("visible_metrics", visibleMetrics)
                .putFloat("threshold_yellow", (float) thresholdYellow)
                .putFloat("threshold_green",  (float) thresholdGreen)
                .apply();

            Log.d(TAG, "Vehicle config saved: fuelPrice=" + fuelPrice
                + " consumptionPerKm=" + consumptionPerKm
                + " primaryMetric=" + primaryMetric
                + " visibleMetrics=" + visibleMetrics
                + " duration=" + overlayDurationMs + "ms"
                + " thresholdYellow=" + thresholdYellow
                + " thresholdGreen=" + thresholdGreen);

            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "Error saving vehicle config: " + e.getMessage());
            call.reject("Erro ao salvar config: " + e.getMessage());
        }
    }

    @PluginMethod
    public void checkBatteryOptimization(PluginCall call) {
        boolean isIgnoring = false;
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                android.os.PowerManager pm = (android.os.PowerManager)
                    getContext().getSystemService(Context.POWER_SERVICE);
                isIgnoring = pm.isIgnoringBatteryOptimizations(getContext().getPackageName());
            } else {
                isIgnoring = true; // Abaixo do Android 6, sem otimização de bateria
            }
        } catch (Exception e) {
            Log.e(TAG, "Error checking battery optimization: " + e.getMessage());
        }
        Log.d(TAG, "Battery optimization ignored: " + isIgnoring);
        JSObject ret = new JSObject();
        ret.put("value", isIgnoring);
        call.resolve(ret);
    }

    @PluginMethod
    public void openBatteryOptimizationSettings(PluginCall call) {
        try {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                // Abre diálogo direto "Ignorar otimizações de bateria para este app"
                Intent intent = new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS);
                intent.setData(Uri.parse("package:" + getContext().getPackageName()));
                intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                if (intent.resolveActivity(getContext().getPackageManager()) != null) {
                    getContext().startActivity(intent);
                    Log.d(TAG, "Opened direct battery optimization dialog");
                } else {
                    // Fallback: abre lista geral de otimização de bateria
                    Intent fallback = new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS);
                    fallback.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
                    getContext().startActivity(fallback);
                    Log.d(TAG, "Opened general battery optimization settings");
                }
            }
            call.resolve();
        } catch (Exception e) {
            Log.e(TAG, "Error opening battery optimization settings: " + e.getMessage());
            call.reject("Erro: " + e.getMessage());
        }
    }

    // Verificação robusta de acessibilidade
    private boolean checkAccessibility(Context context) {
        try {
            String packageName = context.getPackageName();

            // Método 1: Verifica via ENABLED_ACCESSIBILITY_SERVICES
            String enabledServices = Settings.Secure.getString(
                context.getContentResolver(),
                Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
            );

            if (enabledServices == null || enabledServices.isEmpty()) {
                Log.d(TAG, "No enabled accessibility services found");
                return false;
            }

            Log.d(TAG, "Enabled services: " + enabledServices);

            // Verifica o componente completo: "pacote/pacote.Classe"
            String fullComponent = packageName + "/" + packageName + ".RideService";
            String shortComponent = packageName + "/.RideService";

            if (enabledServices.contains(fullComponent) || enabledServices.contains(shortComponent)) {
                Log.d(TAG, "Accessibility ACTIVE via component match: " + fullComponent);
                return true;
            }

            // Fallback: verifica apenas pelo nome do pacote (compatibilidade)
            if (enabledServices.contains(packageName)) {
                Log.d(TAG, "Accessibility ACTIVE via package match: " + packageName);
                return true;
            }

            // Método 2: Verifica via AccessibilityManager (mais confiável em alguns dispositivos MIUI)
            try {
                android.view.accessibility.AccessibilityManager am =
                    (android.view.accessibility.AccessibilityManager)
                    context.getSystemService(Context.ACCESSIBILITY_SERVICE);

                if (am != null) {
                    java.util.List<android.accessibilityservice.AccessibilityServiceInfo> services =
                        am.getEnabledAccessibilityServiceList(
                            android.accessibilityservice.AccessibilityServiceInfo.FEEDBACK_ALL_MASK
                        );
                    if (services != null) {
                        for (android.accessibilityservice.AccessibilityServiceInfo info : services) {
                            String svcPackage = info.getResolveInfo().serviceInfo.packageName;
                            Log.d(TAG, "AccessibilityManager found service: " + svcPackage);
                            if (svcPackage.equals(packageName)) {
                                Log.d(TAG, "Accessibility ACTIVE via AccessibilityManager");
                                return true;
                            }
                        }
                    }
                }
            } catch (Exception amEx) {
                Log.w(TAG, "AccessibilityManager check failed: " + amEx.getMessage());
            }

            Log.d(TAG, "Accessibility NOT active for package: " + packageName);
            return false;

        } catch (Exception e) {
            Log.e(TAG, "Error checking accessibility: " + e.getMessage());
            return false;
        }
    }
}
