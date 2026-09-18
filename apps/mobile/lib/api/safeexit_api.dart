import 'dart:convert';

import 'package:http/http.dart' as http;

import '../models/alarm.dart';

/// Zugriff auf den Alarmdienst.
///
/// Noch ohne Anmeldung: In dieser Ausbaustufe kennt die App die Geraetekennung
/// und sonst nichts. Konten und Sitzungen stehen in docs/roadmap.md.
class SafeExitApi {
  SafeExitApi({required this.baseUrl, http.Client? client})
      : _client = client ?? http.Client();

  /// Im Emulator zeigt 10.0.2.2 auf den Rechner, auf dem der Dienst laeuft.
  static const defaultBaseUrl = String.fromEnvironment(
    'SAFEEXIT_API',
    defaultValue: 'http://10.0.2.2:3001',
  );

  final String baseUrl;
  final http.Client _client;

  Future<Alarm?> activeAlarm(String deviceId) async {
    final response = await _client.get(Uri.parse('$baseUrl/v1/devices/$deviceId/active-alarm'));

    if (response.statusCode != 200 || response.body.isEmpty) {
      return null;
    }

    return Alarm.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  /// "Ich komme." Die erste Quittierung zaehlt.
  Future<Alarm> acknowledge(String alarmId, String responderId, String responderName) async {
    final response = await _client.post(
      Uri.parse('$baseUrl/v1/alarms/$alarmId/acknowledge'),
      headers: const {'content-type': 'application/json'},
      body: jsonEncode({'responderId': responderId, 'responderName': responderName}),
    );

    if (response.statusCode != 200) {
      throw SafeExitApiException('Quittieren hat nicht geklappt (${response.statusCode})');
    }

    return Alarm.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }

  /// Entwarnung. Ohne richtige PIN antwortet der Dienst mit 403.
  Future<Alarm> cancel(String alarmId, String pin) async {
    final response = await _client.post(
      Uri.parse('$baseUrl/v1/alarms/$alarmId/cancel'),
      headers: const {'content-type': 'application/json'},
      body: jsonEncode({'pin': pin}),
    );

    if (response.statusCode == 403) {
      throw SafeExitApiException('Die PIN stimmt nicht.');
    }
    if (response.statusCode != 200) {
      throw SafeExitApiException('Entwarnung hat nicht geklappt (${response.statusCode})');
    }

    return Alarm.fromJson(jsonDecode(response.body) as Map<String, dynamic>);
  }
}

class SafeExitApiException implements Exception {
  const SafeExitApiException(this.message);

  final String message;

  @override
  String toString() => message;
}
