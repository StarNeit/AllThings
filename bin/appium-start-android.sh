#!/bin/sh
# shellcheck shell=dash

#
# Start the Allthings AVD via the Android emulator with custom settings.
#
# Usage: ./appium-start-android.sh
#

AVD="allthingsAVD"
DEVICE="emulator-5554" # Default for first virtual device.

# Fix Qt issue when invoking the emulator executable,
# see https://issuetracker.google.com/issues/37137213
# TODO: Drop it ASAP!
function emulator { cd "$ANDROID_SDK_ROOT"/tools && ./emulator "$@"; }

# Expand the partition size and make the system writable.
# Intel HAXM or KVM must be available for VM acceleration!
echo "--- Expanding the the partition size and make the system writable"
emulator @"$AVD" \
         -accel on \
         -memory 1024 \
         -noaudio \
         -partition-size 512 \
         -skin 1080x1920 \
         -writable-system &

# Wait for the adb server to be ready and the device to be started.
echo "--- Waiting for adb server to be ready and the device to be started"
adb wait-for-device
DEVICE_BOOT_DONE=$(adb shell getprop sys.boot_completed | tr -d "\r")
while [ "$DEVICE_BOOT_DONE" != "1" ]; do
  sleep 2
  DEVICE_BOOT_DONE=$(adb shell getprop sys.boot_completed | tr -d "\r")
done
adb shell input keyevent 82

# Restart the adbd daemon with root permissions.
echo "--- Restarting the adbd daemon with root permissions."
adb root

# Remount the device to tell the emulator to remount system/ as read/write.
echo "--- Remounting device with r\w permissions on system/"
adb -s "$DEVICE" remount

# Create and push news hosts file to the device.
# Use the alias to the host loopback interface,
# see https://developer.android.com/studio/run/emulator-networking.html
echo "--- Updating device hosts"
sudo cat /etc/hosts | \
  sed -e '/## devenv hostnames start/,/## devenv hostnames end/!d;//d' | \
  sed -e 's/127.0.0.1/10.0.2.2/g' > devhosts
adb -s "$DEVICE" pull /system/etc/hosts androidhosts
cat androidhosts devhosts > hosts
adb -s "$DEVICE" push hosts /system/etc/hosts
rm androidhosts devhosts hosts

echo # Newline for better readability.
