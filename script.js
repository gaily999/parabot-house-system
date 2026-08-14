document.addEventListener("DOMContentLoaded", () => {

  // ==============================
  // DATE AND TIME
  // ==============================

  const dateTime = document.getElementById("currentDateTime");

  function updateDateTime() {
    const now = new Date();

    dateTime.textContent = now.toLocaleString("en-PH", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true
    });
  }

  updateDateTime();
  setInterval(updateDateTime, 1000);


  // ==============================
  // ESP32 IP ADDRESS
  // ==============================

  const espIp = document.getElementById("espIp");
  const saveIp = document.getElementById("saveIp");
  const connStatus = document.getElementById("connStatus");

  const savedIp = localStorage.getItem("esp32Ip");

  if (savedIp) {
    espIp.value = savedIp;
    connStatus.textContent = `ESP32 address saved: ${savedIp}`;
  }

  saveIp.addEventListener("click", () => {

    const ip = espIp.value.trim();

    if (!ip) {
      connStatus.textContent =
        "Please enter the ESP32 IP address.";
      return;
    }

    localStorage.setItem("esp32Ip", ip);

    connStatus.textContent =
      `ESP32 address saved: ${ip}`;

    getESP32Status();
  });


  // ==============================
  // ELEMENTS
  // ==============================

  const motionIndicator =
    document.getElementById("motionIndicator");

  const motionStatus =
    document.getElementById("motionStatus");

  const summaryMotion =
    document.getElementById("summaryMotion");

  const oledMotion =
    document.getElementById("oledMotion");


  const temperature =
    document.getElementById("temperature");

  const humidity =
    document.getElementById("humidity");

  const oledTemperature =
    document.getElementById("oledTemperature");

  const oledHumidity =
    document.getElementById("oledHumidity");

  const summaryTemperature =
    document.getElementById("summaryTemperature");

  const summaryHumidity =
    document.getElementById("summaryHumidity");


  const soundStatus =
    document.getElementById("soundStatus");

  const soundState =
    document.getElementById("soundState");

  const summarySound =
    document.getElementById("summarySound");

  const oledSound =
    document.getElementById("oledSound");


  const oledStatus =
    document.getElementById("oledStatus");

  const summaryOled =
    document.getElementById("summaryOled");


  const alarmStatus =
    document.getElementById("alarmStatus");

  const alarmIndicator =
    document.getElementById("alarmIndicator");

  const alarmOn =
    document.getElementById("alarmOn");

  const alarmOff =
    document.getElementById("alarmOff");

  const oledAlarm =
    document.getElementById("oledAlarm");

  const summaryAlarm =
    document.getElementById("summaryAlarm");


  // ==============================
  // MOTION STATUS
  // ==============================

  function updateMotionStatus(detected) {

    if (detected) {

      motionIndicator.textContent =
        "TRIGGERED";

      motionIndicator.classList.remove(
        "safe"
      );

      motionIndicator.classList.add(
        "triggered"
      );

      motionStatus.textContent =
        "DETECTED";

      oledMotion.textContent =
        "DETECTED";

      summaryMotion.textContent =
        "TRIGGERED";

      summaryMotion.classList.remove(
        "safe"
      );

      summaryMotion.classList.add(
        "triggered"
      );

    } else {

      motionIndicator.textContent =
        "SAFE";

      motionIndicator.classList.remove(
        "triggered"
      );

      motionIndicator.classList.add(
        "safe"
      );

      motionStatus.textContent =
        "NOT DETECTED";

      oledMotion.textContent =
        "SAFE";

      summaryMotion.textContent =
        "SAFE";

      summaryMotion.classList.remove(
        "triggered"
      );

      summaryMotion.classList.add(
        "safe"
      );
    }
  }


  // ==============================
  // TEMPERATURE
  // ==============================

  function updateTemperature(value) {

    if (
      value === null ||
      value === undefined
    ) {
      temperature.textContent = "--";
      oledTemperature.textContent = "--";
      summaryTemperature.textContent = "-- °F";
      return;
    }

    const formatted =
      Number(value).toFixed(1);

    temperature.textContent =
      formatted;

    oledTemperature.textContent =
      formatted;

    summaryTemperature.textContent =
      `${formatted} °F`;
  }


  // ==============================
  // HUMIDITY
  // ==============================

  function updateHumidity(value) {

    if (
      value === null ||
      value === undefined
    ) {
      humidity.textContent = "--";
      oledHumidity.textContent = "--";
      summaryHumidity.textContent = "-- %";
      return;
    }

    const formatted =
      Number(value).toFixed(0);

    humidity.textContent =
      formatted;

    oledHumidity.textContent =
      formatted;

    summaryHumidity.textContent =
      `${formatted} %`;
  }


  // ==============================
  // SOUND SENSOR
  // ==============================

  function updateSoundStatus(detected) {

    if (detected) {

      soundStatus.textContent =
        "DETECTED";

      soundStatus.classList.remove(
        "safe"
      );

      soundStatus.classList.add(
        "triggered"
      );

      soundState.textContent =
        "DETECTED";

      oledSound.textContent =
        "DETECTED";

      summarySound.textContent =
        "DETECTED";

      summarySound.classList.remove(
        "safe"
      );

      summarySound.classList.add(
        "triggered"
      );

    } else {

      soundStatus.textContent =
        "SAFE";

      soundStatus.classList.remove(
        "triggered"
      );

      soundStatus.classList.add(
        "safe"
      );

      soundState.textContent =
        "NOT DETECTED";

      oledSound.textContent =
        "SAFE";

      summarySound.textContent =
        "SAFE";

      summarySound.classList.remove(
        "triggered"
      );

      summarySound.classList.add(
        "safe"
      );
    }
  }


  // ==============================
  // OLED STATUS
  // ==============================

  function updateOLEDStatus(connected) {

    if (connected) {

      oledStatus.textContent =
        "CONNECTED";

      summaryOled.textContent =
        "CONNECTED";

    } else {

      oledStatus.textContent =
        "DISCONNECTED";

      summaryOled.textContent =
        "DISCONNECTED";
    }
  }


  // ==============================
  // ALARM STATUS
  // ==============================

  function updateAlarmStatus(active) {

    if (active) {

      alarmStatus.textContent =
        "ON";

      alarmIndicator.textContent =
        "TRIGGERED";

      alarmIndicator.classList.remove(
        "safe"
      );

      alarmIndicator.classList.add(
        "triggered"
      );

      summaryAlarm.textContent =
        "ON";

      summaryAlarm.classList.remove(
        "safe"
      );

      summaryAlarm.classList.add(
        "triggered"
      );

      oledAlarm.textContent =
        "ON";

      document.body.classList.add(
        "alarm-active"
      );

    } else {

      alarmStatus.textContent =
        "OFF";

      alarmIndicator.textContent =
        "SAFE";

      alarmIndicator.classList.remove(
        "triggered"
      );

      alarmIndicator.classList.add(
        "safe"
      );

      summaryAlarm.textContent =
        "OFF";

      summaryAlarm.classList.remove(
        "triggered"
      );

      summaryAlarm.classList.add(
        "safe"
      );

      oledAlarm.textContent =
        "OFF";

      document.body.classList.remove(
        "alarm-active"
      );
    }
  }


  // ==============================
  // ALARM BUTTONS
  // ==============================

  alarmOn.addEventListener("click", () => {

    updateAlarmStatus(true);

    sendToESP32(
      "/alarm/on"
    );
  });


  alarmOff.addEventListener("click", () => {

    updateAlarmStatus(false);

    sendToESP32(
      "/alarm/off"
    );
  });


  // ==============================
  // ESP32 COMMUNICATION
  // ==============================

  async function sendToESP32(endpoint) {

    const ip =
      localStorage.getItem("esp32Ip");

    if (!ip) {

      connStatus.textContent =
        "ESP32 IP address not configured.";

      return;
    }

    try {

      const response =
        await fetch(
          `http://${ip}${endpoint}`,
          {
            method: "GET"
          }
        );

      if (!response.ok) {
        throw new Error(
          "ESP32 request failed."
        );
      }

      connStatus.textContent =
        `Connected to ESP32: ${ip}`;

    } catch (error) {

      connStatus.textContent =
        "Unable to connect to ESP32.";

      console.error(
        "ESP32 communication error:",
        error
      );
    }
  }


  // ==============================
  // GET ESP32 STATUS
  // ==============================

  async function getESP32Status() {

    const ip =
      localStorage.getItem("esp32Ip");

    if (!ip) {
      return;
    }

    try {

      const response =
        await fetch(
          `http://${ip}/status`
        );

      if (!response.ok) {
        throw new Error(
          "Status request failed."
        );
      }

      const data =
        await response.json();


      // MOTION

      if (
        typeof data.motion !==
        "undefined"
      ) {

        updateMotionStatus(
          data.motion
        );
      }


      // TEMPERATURE

      if (
        typeof data.temperature !==
        "undefined"
      ) {

        updateTemperature(
          data.temperature
        );
      }


      // HUMIDITY

      if (
        typeof data.humidity !==
        "undefined"
      ) {

        updateHumidity(
          data.humidity
        );
      }


      // SOUND

      if (
        typeof data.sound !==
        "undefined"
      ) {

        updateSoundStatus(
          data.sound
        );
      }


      // OLED

      if (
        typeof data.oled !==
        "undefined"
      ) {

        updateOLEDStatus(
          data.oled
        );
      }


      // ALARM

      if (
        typeof data.alarm !==
        "undefined"
      ) {

        updateAlarmStatus(
          data.alarm
        );
      }


      connStatus.textContent =
        `Connected to ESP32: ${ip}`;

    } catch (error) {

      connStatus.textContent =
        "ESP32 unavailable.";

      updateOLEDStatus(false);

      console.log(
        "ESP32 status unavailable."
      );
    }
  }


  // ==============================
  // INITIAL STATE
  // ==============================

  updateMotionStatus(false);

  updateTemperature(null);

  updateHumidity(null);

  updateSoundStatus(false);

  updateOLEDStatus(false);

  updateAlarmStatus(false);


  // ==============================
  // STATUS POLLING
  // ==============================

  getESP32Status();

  setInterval(
    getESP32Status,
    2000
  );

});