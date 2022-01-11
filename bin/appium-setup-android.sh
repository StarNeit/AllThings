#!/bin/sh
# shellcheck shell=dash

#
# Fetch the Android image and create a custom Android Virtual Device.
#
# Usage: ./appium-setup-android.sh
#

ANDROID_IMAGE="system-images;android-26;google_apis;x86"
AVD="allthingsAVD"

# Process will fail if this file is missing.
touch ~/.android/repositories.cfg

# Get the Android image.
echo "--- Fetching the Android image"
sdkmanager "$ANDROID_IMAGE"

# Create the platforms directory, will fail if missing.
mkdir -p $ANDROID_SDK_ROOT/platforms

# Create an Allthings Android Virtual Device.
# Android version should match the Android SDK image version!
echo "--- Creating a custom Allthings Android Virtual Device."
echo no | avdmanager --silent create avd \
                     --abi "google_apis/x86" \
                     --device "pixel" \
                     --force \
                     --name "$AVD" \
                     --package "$ANDROID_IMAGE"

echo # Newline for better readability.
