# Publish / Deployment auf Produktion

Diese Dokumentation beschreibt, wie das Projekt **Coding-Camp-2026** über **GitHub Actions** gebaut, als Docker-Image veröffentlicht und anschließend automatisch auf dem Produktivsystem aktualisiert wird.

## Überblick

Der Workflow befindet sich in:

```text
.github/workflows/docker-publish.yml
```

Er übernimmt zwei Aufgaben:

1. **Build und Publish des Docker-Images**
2. **Deployment auf das Produktivsystem per SSH**

## Auslöser

Der Workflow wird ausgeführt bei:

- Push auf den Branch `main`
- Pull Requests auf `main`
- Tags im Format `v*.*.*`

Wichtig:
- Das eigentliche Deployment auf Produktion läuft **nur** bei einem `push` auf `main`
- Bei Pull Requests wird nur gebaut, aber nicht deployt

## Ablauf des Publish-Prozesses

### 1. Docker Build

Im ersten Job wird das Projekt gebaut und als Docker-Image vorbereitet.

Dabei werden folgende Schritte ausgeführt:

- Repository auschecken
- `cosign` installieren
- Docker Buildx einrichten
- Login in die GitHub Container Registry (`ghcr.io`)
- Docker-Metadaten erzeugen
- Docker-Image bauen und pushen
- Docker-Image signieren

### 2. Deployment auf Produktion

Nach erfolgreichem Build startet der Job `deploy-production`.

Dieser verbindet sich per SSH mit dem Produktivserver und führt dort folgende Befehle aus:

```bash
cd /opt/coding-camp-2026
docker compose pull
docker compose up -d
docker image prune -f
```

## Voraussetzungen

Damit das Deployment funktioniert, müssen folgende Voraussetzungen erfüllt sein.

### 1. Docker Compose auf dem Produktionsserver

Auf dem Server muss eine lauffähige `docker-compose.yml` für das Projekt vorhanden sein.

Beispielpfad:

```text
/opt/coding-camp-2026
```

Falls der echte Pfad abweicht, muss der Workflow angepasst werden.

### 2. Image-Referenz in docker-compose.yml

Die Compose-Datei sollte auf das veröffentlichte Image zeigen, z. B.:

```yaml
image: ghcr.io/sybit-education/coding-camp-2026:main
```

### 3. SSH-Zugang

GitHub Actions benötigt SSH-Zugriff auf den Produktionsserver.

Dafür wird ein eigenes Deploy-Key-Paar verwendet.

## Benötigte GitHub Secrets

Im GitHub-Repository müssen folgende Secrets gesetzt werden:

- `PROD_SSH_HOST`  
  Hostname oder IP-Adresse des Produktionsservers

- `PROD_SSH_USER`  
  SSH-Benutzer für das Deployment

- `PROD_SSH_PRIVATE_KEY`  
  Privater SSH-Schlüssel für den Zugriff vom Workflow auf den Server

## SSH-Key einrichten

### 1. Schlüsselpaar erzeugen

Beispiel:

```bash
ssh-keygen -t ed25519 -C "github-actions-deploy" -f deploy_ci_key -N ""
```

### 2. Public Key auf dem Server hinterlegen

Den Inhalt von `deploy_ci_key.pub` in die Datei `~/.ssh/authorized_keys` des Deploy-Benutzers auf dem Server eintragen.

Beispiel:

```bash
echo "ssh-ed25519 AAAA..." >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### 3. Private Key als GitHub Secret speichern

Den Inhalt der Datei `deploy_ci_key` vollständig in das Repository Secret `PROD_SSH_PRIVATE_KEY` kopieren.

## Deployment-Verhalten

Bei einem Push auf `main` passiert Folgendes:

1. GitHub Actions baut das Docker-Image
2. Das Image wird nach `ghcr.io` veröffentlicht
3. Der Deployment-Job verbindet sich per SSH mit dem Produktionsserver
4. Der Server zieht das neue Image
5. Die Container werden mit `docker compose up -d` aktualisiert
6. Nicht mehr benötigte Images werden entfernt

## Wichtige Hinweise

- Der Deployment-Pfad `/opt/coding-camp-2026` ist ein Beispiel und muss zum echten Server-Setup passen
- Der Deploy-Benutzer auf dem Server muss Berechtigungen haben, `docker compose` auszuführen
- Falls `docker compose` nur mit `sudo` funktioniert, muss das Deployment-Script entsprechend angepasst werden
- Das Deployment wird aktuell direkt auf Produktion ausgeführt, ohne separate Staging-Stufe

## Mögliche Erweiterungen

Folgende Verbesserungen sind später sinnvoll:

- separates Deployment für Staging
- manueller Freigabeschritt für Produktion
- Healthcheck nach Deployment
- Rollback-Mechanismus
- Benachrichtigung bei Fehlern oder erfolgreichem Deploy

## Zusammenfassung

Das Projekt wird über GitHub Actions automatisch veröffentlicht und auf Produktion aktualisiert.

Die zentrale Logik ist:

- Build des Docker-Images
- Push nach GHCR
- SSH-Verbindung zum Server
- `docker compose pull` und `docker compose up -d`

Damit kann **Coding-Camp-2026** nach Änderungen auf `main` direkt auf dem Produktivsystem aktualisiert werden.
