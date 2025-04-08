export default function Sidebar() {
    return (
      <div className="h-[calc(100vh-64px)] overflow-y-auto p-4 bg-white w-[400px] border-r shadow-md flex flex-col">
        <h2 className="text-2xl font-bold text-blue-600 mb-2">🧠 Stroke Detection Guide</h2>
        <p className="text-gray-700 mb-4">
          Follow these simple steps to get the most accurate results:
        </p>
  
        <div className="space-y-4 flex-1">
          {/* Steps */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="font-medium">😊 <strong>Try Smiling</strong></p>
            <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
              <li>Look directly into the camera</li>
              <li>Give a big, natural smile</li>
              <li>We're checking for symmetry in your expression</li>
            </ul>
          </div>
  
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="font-medium">🙋 <strong>Raise Both Arms</strong></p>
            <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
              <li>Lift both arms up to shoulder level</li>
              <li>Hold them there for a few seconds</li>
              <li>We're watching for any imbalance or drift</li>
            </ul>
          </div>
  
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <p className="font-medium">🗣️ <strong>Read This Out Loud</strong></p>
            <ul className="list-disc pl-5 mt-2 text-sm text-gray-700">
              <li>Click the <em>Start Recording</em> button</li>
              <li>Read: <em>"She sells seashells by the seashore"</em></li>
              <li>Speak clearly and at a normal pace</li>
            </ul>
          </div>
  
          {/* Tip */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="font-medium">🪞 <strong>Bonus Tip</strong></p>
            <p className="mt-1 text-sm">
              Keep your head and body straight. Avoid leaning — it helps improve detection accuracy!
            </p>
          </div>
  
          {/* All set */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="font-medium">✅ <strong>You're All Set!</strong></p>
            <p className="mt-1 text-sm">
              Once you're done, StrokeShield will analyze your results and let you know if anything seems off.
            </p>
          </div>
  
          {/* Emergency section */}
          <div>
            <h2 className="text-xl font-semibold text-red-600 mb-2">🚨 What to Do If a Stroke Is Detected</h2>
  
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
                If you notice any of these signs, call for help immediately. Time is critical in stroke care.
              </p>
            </div>
  
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <p className="font-semibold text-blue-800 mb-1">💡 Disclaimer</p>
              <p className="text-sm text-gray-800">
                This app provides guidance and monitoring support, but it is <strong>not a substitute for professional medical diagnosis</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  