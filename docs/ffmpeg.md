# Ffmpeg Wrapper Docs

In order for the conversions to execute properly `ffmpeg` needs to be installed in the environment. Additional to that the correct path to you `ffmpeg`-installation **must** be provided.

## Correct path for ffmpeg

In order to work properly a correct set PATH variable for ffmpeg needs to exist. When running this webservice within this docker (based on [teamparallax/ffmpeg-alpine:1.0.3-rc](https://hub.docker.com/r/teamparallax/ffmpeg-alpine)) the ffmpeg installation path is `/opt/ffmpeg/bin/ffmpeg`. The used library `fluent-ffmpeg` will use the value of FFMPEG_PATH variable to run `ffmpeg`, so the webservice sets this variable on start up (`src/service/api/index.ts`, l. 20), see:

>>>

```typescript
/* If FFMPEG_PATH variable is unset the value
*  defaults to '/opt/ffmpeg/bin/ffmpeg'
*/
Ffmpeg().setFfmpegPath(ffmpegPath)
```

>>>

If you are running the conversion-service without the docker setup ensure to provide your path via the environment (`.env` file):

```.env
FFMPEG_PATH=<custom-path>
```
