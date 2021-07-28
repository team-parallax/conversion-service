# Ffmpeg Wrapper Docs

In order for the conversions to execute properly `ffmpeg` needs to be installed in the environment. Additional to that the correct path to you `ffmpeg`-installation **must** be provided. The pre-built docker image already contains all required
software preinstalled and is ready to run with only a little configuration.

## Correct path for ffmpeg

If you are running the `conversion-service` without the docker setup ensure to provide your ffmpeg-path via the environment (`.env` file):

```.env
FFMPEG_PATH=<custom-path>
```
