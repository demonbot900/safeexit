import 'package:flutter/material.dart';

/// Markenfarben aus dem Businessplan 8: Schwarz, Sand, Terrakotta.
/// Bewusst kein Medizin- oder Behoerdenlook.
class SafeExitColors {
  static const schwarz = Color(0xFF141311);
  static const sand = Color(0xFFE9DFCE);
  static const sandHell = Color(0xFFF6F1E7);
  static const terrakotta = Color(0xFFC05B3C);
  static const gruen = Color(0xFF3F7D5C);
}

ThemeData safeExitTheme() {
  final scheme = ColorScheme.fromSeed(
    seedColor: SafeExitColors.terrakotta,
    primary: SafeExitColors.terrakotta,
    surface: SafeExitColors.sandHell,
  );

  return ThemeData(
    useMaterial3: true,
    colorScheme: scheme,
    scaffoldBackgroundColor: SafeExitColors.sandHell,
    appBarTheme: const AppBarTheme(
      backgroundColor: SafeExitColors.sandHell,
      foregroundColor: SafeExitColors.schwarz,
      elevation: 0,
      centerTitle: false,
    ),
    filledButtonTheme: FilledButtonThemeData(
      style: FilledButton.styleFrom(
        minimumSize: const Size.fromHeight(56),
        textStyle: const TextStyle(fontSize: 18, fontWeight: FontWeight.w600),
      ),
    ),
    cardTheme: CardThemeData(
      color: Colors.white,
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(16),
        side: const BorderSide(color: Color(0xFFD8CDB8)),
      ),
    ),
  );
}
