import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

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
            className="m-2 bg-transparent border-3 rounded-full w-full text-xl text-white mr-3 py-3 px-4 focus:outline-none"
            type="text"
            onChange={handleInputChange}
            placeholder="Enter IP Address"
          />
          <button
            className="cursor-pointer flex-shrink-0 bg-teal-500 hover:bg-teal-700 border-teal-500 hover:border-teal-700 text-sm border-4 text-white py-1 px-2 rounded"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
      {ip && !httpError && browser && (
        <div className="mt-4">
          <div className="text-lg font-bold mb-1">IP Address Information</div>
          <div className="border-b border-gray-200"></div>
          <div className="my-1 flex">
            <div className="text-yellow font-bold mb-2">IPV4 Address: </div>
            <span className="ml-1 text-gray-900">{ip.ip}</span>
          </div>
          <div className="my-1 flex">
            <div className="text-yellow font-bold mb-2">Organization: </div>
            <span className="text-gray-900 ml-1">{ip.org}</span>
          </div>
          <div className="my-1 flex">
            <div className="text-yellow font-bold mb-2">Location:</div>
            <span className="ml-1 text-gray-900">
              {ip.city}, {ip.country_name}
            </span>
          </div>
          <div className="pl-4 pt-2 rounded-full border-1 border-solid">
            <div className="my-1 flex">
              <div className="text-yellow font-bold mb-2 ">
                IP Address Timezone:
              </div>
              <span className="ml-1 text-gray-900">{ip.timezone}</span>
            </div>
            <div className="my-1 flex">
              <div className="text-yellow font-bold mb-2">
                Your Browser Timezone:
              </div>
              <span className="text-gray-900">{browser.timezone}</span>
            </div>
          </div>
          <div className="mt-4 pl-4 pt-2 rounded-full border-1 border-solid">
            <div className="my-1 flex">
              <div className="text-yellow font-bold mb-2">
                IP Address Language:
              </div>
              <span className="ml-1 text-gray-900">
                {ip.languages.split(",")[0]}
              </span>
            </div>
            <div className="my-1 flex">
              <div className="text-yellow font-bold mb-2">
                Your Browser Language:
              </div>
              <span className="ml-1 text-gray-900">{browser.language}</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="text-lg font-bold mb-2">Browser Information</div>
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
              <div className="text-yellow font-bold mb-2">OS:</div>
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
