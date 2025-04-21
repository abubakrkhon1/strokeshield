"use client";

export default function Sidebar() {
  return (
    <aside className="h-[calc(100vh-64px)] overflow-y-auto p-4 bg-white w-[380px] shadow-md flex flex-col border-r border-gray-200">
      <h2 className="text-2xl font-bold text-blue-600 mb-2">🧠 Stroke Detection Guide</h2>
      <p className="text-gray-700 mb-4 text-sm">
        Follow each step carefully to ensure accurate scanning and detection.
      </p>

      <div className="space-y-4 flex-1">

        {/* Smile Scan */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="font-semibold">😊 Smile Detection</p>
          <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
            <li>Look directly at the camera</li>
            <li>Smile naturally and fully</li>
            <li>Keep your face centered in the frame</li>
          </ul>
        </div>

        {/* Eyebrow Scan */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="font-semibold">🤨 Eyebrow Movement</p>
          <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
            <li>Raise both eyebrows simultaneously</li>
            <li>Keep your head still and eyes open</li>
            <li>Avoid tilting or frowning</li>
          </ul>
        </div>

        {/* Voice Scan */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
          <p className="font-semibold">🗣️ Voice Clarity</p>
          <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
            <li>Press the <em>Start Recording</em> button</li>
            <li>Read the sentence on screen clearly</li>
            <li>Maintain normal tone and speed</li>
          </ul>
        </div>

        {/* Tip */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="font-semibold">🪞 Bonus Tip</p>
          <p className="mt-1 text-sm text-gray-700">
            Sit upright and avoid leaning. Consistent posture helps improve detection accuracy.
          </p>
        </div>

        {/* All Set */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="font-semibold">✅ You're Ready!</p>
          <p className="mt-1 text-sm text-gray-700">
            Complete all scans and proceed to view your results. StrokeShield will analyze your inputs and provide a risk summary.
          </p>
        </div>

        {/* Emergency Info */}
        <div>
          <h3 className="text-lg font-semibold text-red-600 mb-2">
            🚨 In Case of Emergency
          </h3>

          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-3">
            <p className="font-semibold text-red-700 mb-1">🔴 Remember FAST:</p>
            <ul className="list-disc pl-5 text-sm text-gray-800">
              <li><strong>F</strong> – Face drooping</li>
              <li><strong>A</strong> – Arm weakness</li>
              <li><strong>S</strong> – Speech difficulty</li>
              <li><strong>T</strong> – Time to call emergency services</li>
            </ul>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-3">
            <p className="font-semibold text-yellow-800 mb-1">📞 Call Emergency Services</p>
            <p className="text-sm text-gray-800">
              If any stroke symptoms are detected, call for medical help immediately. Time is critical.
            </p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="font-semibold text-blue-800 mb-1">💡 Disclaimer</p>
            <p className="text-sm text-gray-800">
              StrokeShield is a screening tool, not a medical diagnosis. Always consult a healthcare professional if in doubt.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
