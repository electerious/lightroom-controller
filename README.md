# lightroom-controller

![Build](https://github.com/electerious/lightroom-controller/workflows/Build/badge.svg)

Control Adobe Lightroom CC using HTTP requests by using the Lightroom External Controller API.

![lightroom-controller](https://github.com/user-attachments/assets/a0fdfe43-35a3-413e-8f77-d0616fcf923d)

> ⚠️ This project is still in development and may not work as expected. Use at your own risk!

> 💡 This project is not affiliated with Adobe Systems Incorporated in any way. It is an independent tool that utilizes the Lightroom External Controller API to provide a simple interface for controlling Lightroom CC.

## Contents

- [Description](#description)
- [Requirements](#requirements)
- [Usage](#usage)
- [API](#api)
- [Options](#options)
- [Examples](#examples)
  - [Karabiner-Elements](#karabiner-elements)

## Description

`lightroom-controller` is a simple CLI that acts as a bridge between external tools and Adobe Lightroom CC. It allows you to control Lightroom's sliders and settings using simple HTTP requests, making it compatible with various tools like Karabiner-Elements, Automator, or custom scripts.

The tool listens for incoming HTTP requests and translates them into actions within Lightroom. This happens through the Lightroom External Controller API, which must be enabled in Lightroom CC.

Using the External Controller API without `lightroom-controller` would require a more complex setup, as it involves handling WebSocket connections and parsing the API's JSON responses, making it hard to combine with other tools.

## Requirements

- Adobe Lightroom CC (v8.4 or newer)
- [Node.js](https://nodejs.org/en/) (v22 or newer)
- [npm](https://npmjs.com) (v10 or newer)

## Usage

### 1. Start Lightroom CC

Launch Adobe Lightroom CC on your computer.

### 2. Enable the External Controller API

Enable the External Controller API in Lightroom CC by going to `Preferences > Interface` and checking the box for "Enable external controllers".

### 3. Start the controller

Start the controller by running the following command in your terminal:

```bash
npx lightroom-controller
```

You should now see a Lightroom dialog asking you to allow the connection from the external controller. Click "Pair" to grant access.

### 4. Send requests

You can now send HTTP requests to control Lightroom. For example, to adjust the exposure:

```bash
curl http://localhost:3000/Exposure2012/increment
```

To adjust the contrast:

```bash
curl http://localhost:3000/Contrast2012/increment
```

## API

```
GET /{command}/{action}
```

### Commands

Commands for controlling Lightroom. The names are based on the weird names used by the Lightroom External Controller API, which are not very intuitive tbh. Not all commands are tested, but most of them should work as expected. The name of the command is passed to Lightroom no matter if known or unknown.

`AutoGrayscaleMix`, `AutoLateralCA`, `Blacks2012`, `BlueHue`, `BlueSaturation`, `CameraProfile`, `Clarity2012`, `ColorGradeBlending`, `ColorNoiseReduction`, `ColorNoiseReductionDetail`, `ColorNoiseReductionSmoothness`, `Contrast2012`, `CorrectionAmount`, `CurveRefineSaturation`, `DefringeGreenAmount`, `DefringePurpleAmount`, `Dehaze`, `DepthCorrectionAmount`, `DepthSource`, `EnhanceDenoise`, `EnhanceDenoiseAmount`, `EnhanceRawDetails`, `EnhanceSuperResolution`, `Exposure2012`, `GrainAmount`, `GrainFrequency`, `GrainSize`, `GrayMixerAqua`, `GrayMixerBlue`, `GrayMixerGreen`, `GrayMixerMagenta`, `GrayMixerOrange`, `GrayMixerPurple`, `GrayMixerRed`, `GrayMixerYellow`, `GreenHue`, `GreenSaturation`, `HDREditMode`, `HDRMaxValue`, `Highlights2012`, `HueAdjustmentAqua`, `HueAdjustmentBlue`, `HueAdjustmentGreen`, `HueAdjustmentMagenta`, `HueAdjustmentOrange`, `HueAdjustmentPurple`, `HueAdjustmentRed`, `HueAdjustmentYellow`, `LensBlur.Active`, `LensBlur.BlurAmount`, `LensBlur.CatEyeAmount`, `LensBlur.HighlightsBoost`, `LensBlur.ShowOverlay`, `LensProfileDistortionScale`, `LensProfileEnable`, `LensProfileVignettingScale`, `LocalBlacks2012`, `LocalClarity2012`, `LocalContrast2012`, `LocalCurveRefineSaturation`, `LocalDefringe`, `LocalDehaze`, `LocalExposure2012`, `LocalGrain`, `LocalHighlights2012`, `LocalLuminanceNoise`, `LocalMoire`, `LocalSaturation`, `LocalShadows2012`, `LocalSharpness`, `LocalTemperature`, `LocalTexture`, `LocalTint`, `LocalWhites2012`, `Look.Amount`, `LuminanceAdjustmentAqua`, `LuminanceAdjustmentBlue`, `LuminanceAdjustmentGreen`, `LuminanceAdjustmentMagenta`, `LuminanceAdjustmentOrange`, `LuminanceAdjustmentPurple`, `LuminanceAdjustmentRed`, `LuminanceAdjustmentYellow`, `LuminanceNoiseReductionContrast`, `LuminanceNoiseReductionDetail`, `LuminanceSmoothing`, `OverrideLookVignette`, `PerspectiveUpright`, `PointColorHueShift`, `PointColorLumScale`, `PointColorRangeAmount`, `PointColorSatScale`, `PointColorVisualizeRange`, `PostCropVignetteAmount`, `PostCropVignetteFeather`, `PostCropVignetteHighlightContrast`, `PostCropVignetteMidpoint`, `PostCropVignetteRoundness`, `RedHue`, `RedSaturation`, `SDRBlend`, `SDRBrightness`, `SDRClarity`, `SDRContrast`, `SDRHighlights`, `SDRShadows`, `SDRWhites`, `Saturation`, `SaturationAdjustmentAqua`, `SaturationAdjustmentBlue`, `SaturationAdjustmentGreen`, `SaturationAdjustmentMagenta`, `SaturationAdjustmentOrange`, `SaturationAdjustmentPurple`, `SaturationAdjustmentRed`, `SaturationAdjustmentYellow`, `ShadowTint`, `Shadows2012`, `SharpenDetail`, `SharpenEdgeMasking`, `SharpenRadius`, `Sharpness`, `SplitToningBalance`, `Temperature`, `Texture`, `Tint`, `Vibrance`, `WhiteBalance`, `Whites2012`, `cropBottom`, `cropLeft`, `cropRight`, `cropTop`, `previewForSDRDisplay`, `straightenAngle`, `visualizeHDRRanges`

### Actions

Available actions for each command. The name of the action is passed to Lightroom no matter if known or unknown.

- `increment`: Increases the value of the command by a small amount.
- `decrement`: Decreases the value of the command by a small amount.

## Options

`lightroom-controller` can be configured using environment variables.

### Port

The port to run the server on. Defaults to `3000`.

```bash
PORT=3000 npx lightroom-controller
```

### Lightroom WS URL

The WebSocket URL of your Lightroom instance. Defaults to `ws://127.0.0.1:7682`.

If the port is not available, Lightroom falls back to a different port. The port that it uses will be saved into a `connections.json` file by Lightroom.

Mac: `~/Library/Application Support/Adobe/Lightroom CC/Connections`
Windows: `AppData\Local\Adobe\Lightroom CC\Connections`

```bash
LIGHTROOM_WS_URL=ws://127.0.0.1:7682 npx lightroom-controller
```

## Examples

### Karabiner-Elements

You can use `lightroom-controller` with [Karabiner-Elements](https://karabiner-elements.pqrs.org/) to control Lightroom using keyboard shortcuts. Here's an example configuration that maps the `F1` key to increase the exposure and the `F2` key to decrease it:

```json
{
  "title": "Lightroom Controller",
  "rules": [
    {
      "description": "Control Lightroom Exposure",
      "manipulators": [
        {
          "type": "basic",
          "from": {
            "key_code": "f1"
          },
          "to": [
            {
              "shell_command": "curl http://localhost:3000/Exposure2012/increment"
            }
          ]
        },
        {
          "type": "basic",
          "from": {
            "key_code": "f2"
          },
          "to": [
            {
              "shell_command": "curl http://localhost:3000/Exposure2012/decrement"
            }
          ]
        }
      ]
    }
  ]
}
```
