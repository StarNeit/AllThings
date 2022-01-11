# Run e2e tests against the development environment via Appium:

## Setup

### Java

For Mac users, use *brew* with cask:

```sh
# Perform this step only if you don't have cask installed.
brew tap caskroom/cask
```

```sh
brew cask install java
```

For Linux users, please install the latest Java SDK via your distro's installation tools.

Set the following environment variables in your shell (Mac users):

```sh
export JAVA_HOME=$(/usr/libexec/java_home)
export PATH=$JAVA_HOME/bin:$PATH
```

### Android SDK

For Mac users:

```sh
brew cask install android-sdk
```

For Linux users, please install the latest Android SDK via your distro's installation tools or refer to [Android Studio instructions](https://developer.android.com/studio/index.html).

Set the following environment variable in your shell (Mac users):

```sh
export ANDROID_HOME=/usr/local/share/android-sdk
export ANDROID_SDK_ROOT=/usr/local/share/android-sdk
```

### Intel HAXM / KVM

Install Intel HAXM (Mac users) or KVM (linux users - use you packet manager), see https://developer.android.com/studio/run/emulator-acceleration.htmlandroid:

```sh
brew cask install intel-haxm
```

### Carthage - Mac users only

In order to automate iOS devices with Xcode 8 (which includes all testing of iOS 10+), you need to install the Carthage dependency manager:

```sh
brew install carthage
```

### Get the SDK & create an Android Virtual Device

```sh
yarn appium-setup-android
```

### Check you current setup with appium-doctor

If you are facing any issue regarding the setup, try to get a diagnostic:

```sh
yarn appium-doctor
```

## Start the e2e tests

### Android

Start the Android Virtual Device first:

```sh
yarn appium-start-android
```

In another terminal, trigger the appium server:

```sh
yarn appium
```

When the device is ready, you can perform all the tests:

```sh
e2e-appium -- --env android
```

Or use specific tags:

```sh
e2e-appium -- --env android --tag notifications
```

### Iphone - Mac only

You need to authorize use of the iOS Simulator by running the following command (you need to do this every time you install a new version of Xcode, not for every test session!):

```sh
sudo yarn appium-authorize-ios
```

In another terminal, trigger the appium server:

```sh
yarn appium
```

When the device is ready, you can perform all the tests:

```sh
e2e-appium -- --env iphone
```

Or use specific tags:

```sh
e2e-appium -- --env iphone --tag notifications
```
