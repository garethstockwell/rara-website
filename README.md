# rara-website

This repository is a monorepo which contains [WordPress](https://wordpress.com/) themes and plugins which are used by the Riverside Area Residents Association (RARA) website, hosted at at [https://www.rar.org.uk](https://www.rar.org.uk)

## Getting started

To build the plugins, install [npm](https://www.npmjs.com/) and then execute the following:

```
npm ci
npm run start
```

This starts a process which watches for the contents of the repository, and automatically triggers a rebuild in response to a change.

## Testing

### Test locally without WordPress

The repository contains a set of HTML files which test functionality exposed by JavaScript modules which are encapsulated inside the plugins. To serve these files using a local webserver, execute the following:

```
npm run open
```

### Test locally using WordPress in Docker

The following instructions show how the themes and plugins can be tested using a local WordPress instance, running in a [Docker](https://www.docker.com/) container.

1. Create a local directory where the WordPress content will be stored, and set the `RARA_WP_CONTENT` environment variable to point to it.

```
export RARA_WP_CONTENT=/some/local/directory
mkdir -p ${RARA_WP_CONTENT}
```

2. Download Updraft backup files (*.zip and *db.gz) from rar.org.uk and store in `${RARA_WP_CONTENT}/updraft`.

```
mkdir -p ${RARA_WP_CONTENT}/updraft
cp <files> ${RARA_WP_CONTENT}/updraft
```

3. Start the Docker container

```
./docker/compose.sh up
```

This maps the themes and plugins folders from the working directory of this repository into the container.

4. Open Wordpress by browsing to http://localhost:8000

5. Create a user.
   The login details don't matter since this will be overwritten by the credentials restored via Updraft - so username "test" and password "test" are fine.

6. Log in

- Activate the "RARA" theme.
- Activate all "RARA" plugins.
- Install [UpdraftPlus: WP Backup & Migration Plugin](https://teamupdraft.com/updraftplus/).

7. Go to the Updraft settings page. Under "Existing backups" you should see one entry, with the following components:

- Database
- Plugins
- Themes
- Uploads
- Others
  Restore this backup, ticking all components.

8. Log in with the credential restored from the remote server via Updraft.

### Deploy local build to remote WordPress instance

The following instructions show how a local build can be deployed to a remote WordPress instance, which could be the production rar.org.uk server.

To generate zip files, execute the following:

```
npm run zip
```

Then upload the zip files to the WordPress server.

### Deploy GitHub build to remote WordPress instance

As described in the [Continuous Integration](#continuous-integration) section below, a GitHub action publishes build artifacts to a "deploy" branch. The [WP Pusher](https://wppusher.com/) plugin can be used to fetch these artifacts from GitHub and install the plugins / themes directly on the WordPress server.

## Continuous Integration

This repository defines a [GitHub workflow](https://docs.github.com/en/actions) which includes the following steps:

- Build plugins.
- Push the build outputs to a branch called `deploy-<source branch>`. For example, when a commit is pushed to `main` the build outputs are pushed to `deploy-main`.
