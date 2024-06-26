import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { FiCheck, FiX } from "react-icons/fi";

interface IpData {
  ip: string;
  org: string;
  city: string;
  country_name: string;
  timezone: string;
  languages: string;
}

interface BrowserData {
  fingerprint: string;
  userAgent: string;
  plugins: string;
  os: string;
  deviceType: string;
  language: string;
  timezone: string;
}

const IpAddress = () => {
  const [ipAddress, setIpAddress] = useState<string>("");
  const [ip, setIp] = useState<IpData | null>(null);
  const [httpError, setHttpError] = useState<string | null>(null);
  const [browser, setBrowser] = useState<BrowserData | null>(null);
  const [screenSize, setScreenSize] = useState<string>("");

  const getIp = () => {
    fetch(`https://ipapi.co/json/?protocol=ipv4`) // Add ?type=ipv4 query parameter
      .then((res) => {
        if (res.ok) {
          setHttpError(null);
          return res.json();
        } else {
          throw new Error("Failed to fetch your ip address");
        }
      })
      .then((data) => {
        setIpAddress(data.ip);
        setIp(data);
      })
      .catch((err) => {
        setHttpError("Failed to get your ip address !");
      });
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (ipAddress !== "") {
      fetch(`https://ipapi.co/${ipAddress}/json/`)
        .then((res) => {
          if (res.ok) {
            setHttpError(null);
            return res.json();
          } else {
            throw new Error("Failed to fetch ip address");
          }
        })
        .then((data) => {
          setIp(data);
        })
        .catch((err) => {
          setHttpError("Failed to get your ip address !");
        });
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIpAddress(event.target.value);
  };

  useEffect(() => {
    // Get user's IP address on component mount
    getIp();

    // Generate browser fingerprint on component mount
    const getFingerprint = async () => {
      const fp = await FingerprintJS.load();
      const result = await fp.get();
      setBrowser({
        fingerprint: result.visitorId,
        userAgent: window.navigator.userAgent,
        plugins: JSON.stringify(
          Array.from(navigator.plugins).map((plugin) => ({
            name: plugin.name,
          }))
        ),
        os: window.navigator.platform,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        deviceType: /Mobi/.test(navigator.userAgent) ? "Mobile" : "Desktop",
      });
    };
    getFingerprint();

    // Get screen resolution on component mount
    setScreenSize(
      `${window.screen.width}x${window.screen.height}x${window.screen.colorDepth}`
    );
  }, []);

  return (
    <div className="max-w-md mx-auto my-4 px-4 py-1 rounded-lg shadow-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500">
      <form onSubmit={handleFormSubmit}>
        <div className="flex items-center border-b border-b-2 border-teal-500 py-1">
          <input
            className="m-2 bg-transparent border-white rounded-full w-full text-xl text-white mr-3 py-2 px-6 placeholder:text-white focus:outline-none"
            type="text"
            onChange={handleInputChange}
            placeholder="Enter IP Address"
          />
          <button
            className="cursor-pointer text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center mt-2 mr-2 mb-2"
            type="submit"
          >
            Check
          </button>
        </div>
      </form>
      {ip && !httpError && browser && (
        <div className="mt-4">
          <div className="text-lg p-2 my-2 text-white bg-black rounded-2 ">
            For successful IP hiding, it is important to have matching{" "}
            <span className="text-red-500">timezones </span>
            and <span className="text-red-500">browser language </span>, and
            you'll see a green checkmark as confirmation once they are aligned.
          </div>
          <div className="pl-4 rounded-12 text-lg bg-amber font-bold mb-1">
            IP Address Information
          </div>
          <div className="flex space-block-sm">
            <div className="text-yellow font-bold ">IP Address: </div>
            <span className="ml-1 pl-2 pr-2 bg-green-700 rounded-2 text-white">
              {ip.ip}
            </span>
          </div>
          <div className="flex space-block-sm">
            <div className="text-yellow font-bold">Organization: </div>
            <span className="text-gray-900 ml-1">{ip.org}</span>
          </div>
          <div className="flex space-block-sm">
            <div className="text-yellow font-bold">Location:</div>
            <span className="ml-1 text-gray-900">
              {ip.city}, {ip.country_name}
            </span>
          </div>

          <div
            className={`pl-4 pt-2 pb-2 rounded-full border-1 border-solid ${
              ip.timezone === browser.timezone
                ? "border-green-700"
                : "border-red-700"
            }`}
          >
            <div className="flex items-center h-8">
              <div
                className={`font-bold ${
                  ip.timezone === browser.timezone
                    ? "text-white"
                    : "text-yellow"
                }`}
              >
                IP Address Timezone:
              </div>
              <span className="ml-2 text-gray-900">{ip.timezone}</span>
              {ip.timezone === browser.timezone ? (
                <div className="flex ml-auto mr-2 bg-green-700 rounded-full p-1">
                  <FiCheck className="text-white" size={30} />
                </div>
              ) : (
                <div className="flex ml-auto mr-2 bg-red-700 rounded-full p-1">
                  <FiX className="text-white" size={30} />
                </div>
              )}
            </div>
            <div className="flex items-center">
              <div
                className={`font-bold ${
                  ip.timezone === browser.timezone
                    ? "text-white"
                    : "text-yellow"
                }`}
              >
                Your Browser Timezone:
              </div>
              <span className="ml-2 text-gray-900">{browser.timezone}</span>
            </div>
          </div>

          <div
            className={`mt-4 pl-4 pb-2 pt-2 rounded-full border-1 border-solid ${
              ip.languages.split(",")[0] === browser.language
                ? "border-green-700"
                : "border-red-700"
            }`}
          >
            <div className="flex items-center h-8">
              <div
                className={`font-bold ${
                  ip.languages.split(",")[0] === browser.language
                    ? "text-white"
                    : "text-yellow"
                }`}
              >
                IP Address Language:
              </div>
              <span className="ml-1 text-gray-900">
                {ip.languages.split(",")[0]}
              </span>
              {ip.languages.split(",")[0] === browser.language ? (
                <div className="flex ml-auto mr-2 bg-green-700 rounded-full p-1">
                  <FiCheck className="text-white" size={30} />
                </div>
              ) : (
                <div className="flex ml-auto mr-2 bg-red-700 rounded-full p-1">
                  <FiX className="text-white" size={30} />
                </div>
              )}
            </div>
            <div className="flex items-center">
              <div
                className={`font-bold ${
                  ip.languages.split(",")[0] === browser.language
                    ? "text-white"
                    : "text-yellow"
                }`}
              >
                Your Browser Language:
              </div>
              <span className="ml-2 text-gray-900">{browser.language}</span>
            </div>
          </div>

          <div className="mt-4">
            <div className="pl-4 rounded-12 text-lg bg-amber font-bold mb-2">
              Browser Information
            </div>
            <div className="border-b border-gray-200"></div>
            <div className="my-1 flex">
              <div className="text-yellow font-bold mb-2">
                Browser Fingerprint:
              </div>
              <span className="ml-1 text-gray-900">{browser.fingerprint}</span>
            </div>
            <div className="my-1 flex">
              <div className="text-yellow font-bold mb-2">User Agent:</div>
              <span className="ml-1 text-gray-900">{browser.userAgent}</span>
            </div>
            <div className="my-1 flex">
              <div className="text-yellow font-bold mb-2">
                Screen Resolution:
              </div>
              <span className="ml-1 text-gray-900">{screenSize}</span>
            </div>
            <div className="my-1 flex">
              <div className="text-yellow font-bold mb-2">OS Identifier:</div>
              <span className="ml-1 text-gray-900">{browser.os}</span>
            </div>

            <div className="my-1 flex">
              <div className="text-yellow font-bold mb-2">Device Type:</div>
              <span className="ml-1 text-gray-900">{browser.deviceType}</span>
            </div>
            <div className="flex">
              <div className="text-yellow font-bold mb-2">Plugins:</div>
              <span className="ml-1">{browser.plugins}</span>
            </div>
          </div>
        </div>
      )}
      {httpError && <p>{httpError}</p>}
    </div>
  );
};
export default IpAddress;
