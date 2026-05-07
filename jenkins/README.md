# Jenkins CI Setup

Local Jenkins instance for the Escape from Windows project. Runs a multi-stage pipeline against the repo on every push to `main`, with test reports, code coverage, and build artifacts published per build.

## What the Pipeline Does

The pipeline is defined in `Jenkinsfile` at the repo root. It runs two stages in parallel:

**Backend stage**
- Compiles the Spring Boot sources with Maven
- Runs JUnit 5 tests, publishes results to the Jenkins UI
- Generates a JaCoCo coverage report (line, branch, method, class)
- Builds the executable Spring Boot JAR
- Archives the JAR against the build

**Frontend stage**
- Installs dependencies with `npm ci`
- Runs ESLint as a non-blocking quality check (reports issues in the log without failing the build)
- Builds the production Vite bundle
- Archives the `dist/` output against the build

Maven and Node.js are not installed on the Jenkins host. They are pulled in by Jenkins tool installers on first use, so the only thing the host needs is Docker.

## Prerequisites

- Docker Desktop installed and running
- About 2 GB of free disk for the Jenkins home volume and tool downloads

## Starting Jenkins

From the repo root:

```bash
cd jenkins
docker compose up -d --build
```

This builds the custom Jenkins image (extends `jenkins/jenkins:lts` with `libatomic1`, which Node 22 needs) and starts the container.

Jenkins is then available at http://localhost:8090.

## First-Time Setup

The first time you start Jenkins, complete the setup wizard:

1. Get the initial admin password:
   ```bash
   docker exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
   ```
2. Open http://localhost:8090 and paste the password.
3. Choose **Install suggested plugins**.
4. Create your admin user.
5. Install two extra plugins under **Manage Jenkins → Plugins → Available**:
   - **NodeJS**
   - **Coverage**
6. Configure two tools under **Manage Jenkins → Tools**:
   - Maven installation named `maven3`, install automatically, latest 3.9.x
   - NodeJS installation named `node22`, install automatically, latest 22.x

## Configuring the Pipeline Job

1. From the dashboard, click **New Item**.
2. Name it `escape-from-windows`, choose **Pipeline**, click OK.
3. In the **Pipeline** section:
   - Definition: **Pipeline script from SCM**
   - SCM: **Git**
   - Repository URL: `https://github.com/mbuiiiz/escape-from-windows`
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`
4. In **Build Triggers**, check **Poll SCM** and enter `H/2 * * * *` (polls GitHub every 2 minutes).
5. Save.

## Triggering a Build

Either:
- Push to `main` and wait up to 2 minutes for SCM polling to fire, or
- Click **Build Now** from the job page for an immediate run.

## What to Look at After a Build

On the build page:
- **Stage View** shows the Backend and Frontend stages running side by side.
- **Test Result** lists pass and fail counts from the JUnit reports.
- **Coverage** shows JaCoCo metrics with per-class drill-down and source highlighting.
- **Build Artifacts** lists the Spring Boot JAR and the `dist/` bundle, downloadable for any historical build.

## File Layout

```
jenkins/
  Dockerfile          Extends jenkins/jenkins:lts with libatomic1
  docker-compose.yml  Builds the image and runs Jenkins on port 8090
  README.md           This file

Jenkinsfile           Pipeline definition (at the repo root)
```

## Stopping and Cleaning Up

Stop Jenkins while keeping all configuration, plugins, jobs, and build history:

```bash
docker compose down
```

Wipe everything, including the Maven and Node caches:

```bash
docker compose down -v
```

All persistent state lives in the named volume `jenkins_home`. Removing the volume means redoing the first-time setup steps above.

## Notes

- Jenkins runs at `localhost:8090` only. It is not exposed to the public internet. Anything that needs an inbound URL (GitHub webhooks, README status badges) would require a tunnel.
- The frontend lint stage is non-blocking on purpose. The hackathon codebase has known issues that fall outside the scope of this CI work, so lint reports them in the log without failing the build.
- The first build after a clean start takes longer (around 5 minutes) because Maven and npm pull down dependencies. Later builds reuse the caches and finish in roughly a minute.
