'use client';
import { useState, useEffect } from 'react';
import { doshaInfo } from '@/lib/doshaCalculator';
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

// Example: you already have userDosha from localStorage
const getTips = (topic, dosha) => {
  const baseTips = {
    meditation: ["Start with 5–10 mins", "Focus on breath", "Stay consistent"],
    stress: ["Deep breathing", "Take breaks", "Journal thoughts"],
    insights: ["Reflect daily", "Track emotions", "Gratitude"],
    exercise: ["Stretching", "Yoga/walking", "Stay active"],
    sleep: ["Sleep on time", "Avoid screens", "Cool room"],
    routine: ["Wake early", "Eat on time", "Consistency"],
  };

  const doshaAdditions = {
    vata: " → Focus on grounding & calmness",
    pitta: " → Avoid overheating & intensity",
    kapha: " → Stay active & energized",
  };

  return baseTips[topic].map(
    (tip) => tip + (dosha ? doshaAdditions[dosha] : "")
  );
};

const seasonsData = {
  summer: {
    title: "Summer",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    foods: "Cooling fruits (🍉watermelon, 🥥coconut), cucumbers, 🌿mint",
    activities: "🏊 Swimming,🚶 Evening walks,🧘 Cooling pranayama",
  },
  winter: {
    title: "Winter",
    image: "https://images.unsplash.com/photo-1483664852095-d6cc6870702d",
    foods: "Warming spices(🫚ginger, 🌰cinnamon), 🥕root vegetables, 🧈ghee",
    activities: "🏠Indoor exercise, 🔥hot yoga, 🧘warming practices",
  },
  spring: {
    title: "Spring",
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946",
    foods: "🥗Light foods, 🥬bitter greens, 🌶pungent spices",
    activities: "🏃Vigorous exercise, 🧼cleansing, 🤸active movement",
  },
  autumn: {
    title: "Autumn",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    foods: "🥣Grounding foods, 🍠sweet vegetables, 🌾warming grains",
    activities: "🚶Moderate activity, 🧘grounding practices, 📅regular routines",
  },
};

export default function LearnPage() {
  const [activeTab, setActiveTab] = useState('doshas');
  const [expandedSection, setExpandedSection] = useState(null);
  const [userDosha, setUserDosha] = useState('pitta');
  const [selectedTopic, setSelectedTopic] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem('doshaResult');
    if (stored) {
      const result = JSON.parse(stored);
      setUserDosha(result.dominant);
      setExpandedSection(result.dominant);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-cream to-primary-light/30 pb-24 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-dark-text mb-2">📚 Learn About Ayurveda</h1>
        <p className="text-gray-text mb-6">Enhance your knowledge about wellness and healthy living</p>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'doshas', label: 'Dosha Learning' },
            { id: 'relax', label: 'LifeStyle & Mind' },
            { id: 'seasonal', label: 'Seasonal Tips' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 rounded-lg font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-dark-text hover:bg-primary-light'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Dosha Learning Tab */}
        {activeTab === 'doshas' && (
          <div className="space-y-4">
            {Object.entries(doshaInfo).map(([key, info]) => (
              <div key={key} className="card">
                <button
                  onClick={() => setExpandedSection(expandedSection === key ? null : key)}
                  className="w-full flex justify-between items-center text-left"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{info.emoji}</span>
                    <div>
                      <h3 className="text-2xl font-bold" style={{ color: info.color }}>{info.name} Dosha</h3>
                      <p className="text-gray-text">{info.tagline}</p>
                    </div>
                  </div>
                  <span className="text-3xl">{expandedSection === key ? '−' : '+'}</span>
                </button>
                
                {expandedSection === key && (
                  <div className="mt-6 pt-6 border-t-2 border-gray-200 space-y-4">
                    <p className="text-lg">{info.description}</p>
                    <div>
                      <h4 className="font-bold text-lg mb-3">Balancing Recommendations:</h4>
                      <ul className="space-y-2">
                        {info.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-xl">✓</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Lifestyle and mind tab */}
        {activeTab === 'relax' && (
        <div className="space-y-6">

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Mind Card */}
            <div className="rounded-2xl shadow-md p-6 bg-gradient-to-br from-yellow-50 to-yellow-100">
              <div className="flex flex-col items-center text-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3048/3048398.png"
                  alt="Exercise"
                  className="w-28 h-28 mb-4"
                />
                <h3 className="text-xl font-semibold mb-2 text-yellow-800">Mind</h3>
                <p className="text-yellow-700 text-sm mb-4">
                  Calm your mind, reduce stress, and find inner balance.
                </p>
              </div>

              <ul className="space-y-3 text-sm text-yellow-900">
                {[
                  { name: "Meditation", key: "meditation", icon: "🧘" },
                  { name: "Stress Relief", key: "stress", icon: "😌" },
                  { name: "Mind Insights", key: "insights", icon: "🧠" },
                ].map((item) => (
                  <li
                    key={item.key}
                    onClick={() => setSelectedTopic(item.key)}
                    className={`cursor-pointer p-2 rounded-lg flex items-center gap-2 transition ${
                      selectedTopic === item.key
                        ? "bg-yellow-100 text-yellow-700"
                        : "hover:bg-yellow-50 hover:text-yellow-600"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>

            {/* Lifestyle Card */}
            <div className="rounded-2xl shadow-md p-6 bg-gradient-to-br from-green-50 to-green-100">
              <div className="flex flex-col items-center text-center">
                <img
                  src="https://cdn-icons-png.flaticon.com/512/3774/3774291.png"
                  alt="Lifestyle"
                  className="w-28 h-28 mb-4"
                />
                <h3 className="text-xl font-semibold mb-2 text-green-800">Lifestyle</h3>
                <p className="text-green-700 text-sm mb-4">
                  Daily movement, better sleep, and a balanced routine.
                </p>
              </div>

              <ul className="space-y-3 text-sm text-green-900">
                {[
                  { name: "Exercise Ideas", key: "exercise", icon: "🏃" },
                  { name: "Sleep Tips", key: "sleep", icon: "😴" },
                  { name: "Daily Routine", key: "routine", icon: "📅" },
                ].map((item) => (
                  <li
                    key={item.key}
                    onClick={() => setSelectedTopic(item.key)}
                    className={`cursor-pointer p-2 rounded-lg flex items-center gap-2 transition ${
                      selectedTopic === item.key
                        ? "bg-green-100 text-green-700"
                        : "hover:bg-green-50 hover:text-green-600"
                    }`}
                  >
                    <span>{item.icon}</span>
                    {item.name}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Animated Tips Section */}
          <AnimatePresence>
            {selectedTopic && (
              <motion.div
                key={selectedTopic}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
                className="bg-white p-6 rounded-2xl shadow-md"
              >
                <h3 className="text-xl font-semibold mb-3 capitalize">
                  {selectedTopic} Tips ({userDosha})
                </h3>

                <ul className="list-disc pl-5 space-y-2 text-gray-600">
                  {getTips(selectedTopic, userDosha).map((tip, i) => (
                    <li key={i}>{tip}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      )}

        {/* Seasonal Tips Tab */}
        {activeTab === 'seasonal' && (
          <div className="p-6">
            <h3 className="text-3xl font-bold mb-2">Seasonal Wellness Guide</h3>
            <p className="text-gray-500 mb-8">Adjust your routine and diet according to the season</p>

            <div className="grid grid-cols-2 gap-4">
              {Object.keys(seasonsData).map((key) => {
                const season = seasonsData[key];

                return (
                  <motion.div
                    key={key}
                    whileHover={{ scale: 1.03 }}
                    className="rounded-2xl overflow-hidden shadow-md bg-white"
                  >
                    <div
                      className="h-40 bg-cover bg-center"
                      style={{ backgroundImage: `url(${season.image})` }}
                    />

                    <div className="p-5">
                      <h4 className="text-xl font-semibold mb-3">{season.title}</h4>

                      <div className="space-y-3">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h5 className="font-medium text-green-700 mb-1">🍽 Foods to Eat</h5>
                          <p className="text-sm text-gray-600">{season.foods}</p>
                        </div>

                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h5 className="font-medium text-blue-700 mb-1">🧘 Activities</h5>
                          <p className="text-sm text-gray-600">{season.activities}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
