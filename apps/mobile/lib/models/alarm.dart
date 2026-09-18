/// Gegenstueck zu AlarmResponse aus packages/api-contracts.
///
/// Wird von Hand gepflegt, weil Dart die TypeScript-Typen nicht lesen kann.
/// Aendert sich der Vertrag, aendert sich diese Datei mit.
class Alarm {
  const Alarm({
    required this.id,
    required this.deviceId,
    required this.wearerName,
    required this.level,
    required this.status,
    required this.triggeredAt,
    required this.acknowledgedBy,
    required this.lastLocation,
  });

  final String id;
  final String deviceId;
  final String wearerName;
  final int level;
  final String status;
  final DateTime triggeredAt;
  final String? acknowledgedBy;
  final AlarmLocation? lastLocation;

  bool get isActive => status == 'active';
  bool get isAcknowledged => acknowledgedBy != null;

  /// Beschriftung der Stufe, wie sie im Businessplan 3.3 beschrieben ist.
  String get levelLabel => switch (level) {
        1 => 'Stiller Alarm an deine Kontakte',
        2 => 'Kontakte und Betriebe in der Naehe',
        3 => 'Kontakte sollen die 110 waehlen',
        _ => 'Unbekannte Stufe',
      };

  static Alarm fromJson(Map<String, dynamic> json) {
    final location = json['lastLocation'] as Map<String, dynamic>?;

    return Alarm(
      id: json['id'] as String,
      deviceId: json['deviceId'] as String,
      wearerName: json['wearerName'] as String,
      level: json['level'] as int,
      status: json['status'] as String,
      triggeredAt: DateTime.parse(json['triggeredAt'] as String),
      acknowledgedBy: json['acknowledgedBy'] as String?,
      lastLocation: location == null ? null : AlarmLocation.fromJson(location),
    );
  }
}

class AlarmLocation {
  const AlarmLocation({
    required this.latitude,
    required this.longitude,
    required this.accuracyMeters,
    required this.source,
    required this.recordedAt,
  });

  final double latitude;
  final double longitude;
  final int accuracyMeters;
  final String source;
  final DateTime recordedAt;

  String get sourceLabel => switch (source) {
        'gnss' => 'Satellitenortung',
        'cell' => 'Mobilfunkzelle',
        'phone' => 'Telefon in der Naehe',
        _ => source,
      };

  static AlarmLocation fromJson(Map<String, dynamic> json) => AlarmLocation(
        latitude: (json['latitude'] as num).toDouble(),
        longitude: (json['longitude'] as num).toDouble(),
        accuracyMeters: (json['accuracyMeters'] as num).round(),
        source: json['source'] as String,
        recordedAt: DateTime.parse(json['recordedAt'] as String),
      );
}
