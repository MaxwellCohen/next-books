self.__ftThirdPartyWorker = { ranAt: Date.now(), strategy: "worker", inWorker: typeof document === "undefined" };
try { if (typeof window !== "undefined") window.__ftThirdPartyWorker = self.__ftThirdPartyWorker; } catch (e) {}
