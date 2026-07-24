import React, { useState, useEffect } from 'react';

// Core Flow Screens
import SplashScreen from './components/SplashScreen';
import WelcomeScreen from './components/WelcomeScreen';
import AuthModal from './components/AuthModal';
import AccountVerificationModal from './components/AccountVerificationModal';
import OnboardingWizard from './components/OnboardingWizard';

// Modals & Persistent Overlays
import AIConciergeSphere from './components/AIConciergeSphere';
import UniversalSearchModal from './components/UniversalSearchModal';
import InteractiveMapModal from './components/InteractiveMapModal';
import LocationPermissionModal from './components/LocationPermissionModal';

// Main OS Workspace Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import DealFinderView from './components/DealFinderView';
import NegotiationStudioView from './components/NegotiationStudioView';
import MarketplaceIntelView from './components/MarketplaceIntelView';
import MissionControl from './components/MissionControl';
import PriceAnalyticsView from './components/PriceAnalyticsView';
import ReportsView from './components/ReportsView';
import HistoryView from './components/HistoryView';
import NotificationsView from './components/NotificationsView';
import ProfileView from './components/ProfileView';
import SettingsView from './components/SettingsView';

// API Service & Sound Utils
import { api, storage } from './services/api';
import { playGlassTap } from './utils/audio';

export default function App() {
  // Global Screen State: 'splash' | 'welcome' | 'auth' | 'verification' | 'onboarding' | 'location_permission' | 'workspace'
  const [screenState, setScreenState] = useState(() => {
    const storedUser = storage.getUser();
    const token = storage.getAccessToken();
    if (token || storedUser) {
      return 'workspace'; // Direct navigation to workspace dashboard if authenticated!
    }
    const hasSeenSplash = sessionStorage.getItem('negosphere_splash_seen');
    return hasSeenSplash === 'true' ? 'welcome' : 'splash';
  });

  const handleSplashComplete = () => {
    sessionStorage.setItem('negosphere_splash_seen', 'true');
    const storedUser = storage.getUser();
    const token = storage.getAccessToken();
    if (token || storedUser) {
      setScreenState('workspace');
    } else {
      setScreenState('welcome');
    }
  };

  // Workspace Tab State
  const [activeTab, setActiveTab] = useState('dashboard');

  // Modals & Technical Inspector Overlays
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMapOpen, setIsMapOpen] = useState(false);
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [userLocation, setUserLocation] = useState({ lat: 28.5494, lng: 77.2520 });

  // User State
  const [user, setUser] = useState(() => {
    return storage.getUser() || {
      name: 'Alexander Vance',
      email: 'executive@company.com',
      role: 'Enterprise AI Procurement Director'
    };
  });

  // Pipeline Execution State
  const [pipelineData, setPipelineData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('Samsung S24 Ultra');

  // Auto-run initial API pipeline query and verify session on mount
  useEffect(() => {
    runPipeline('Samsung S24 Ultra');
    
    // Check & validate session with backend
    const checkSession = async () => {
      const token = storage.getAccessToken();
      if (token) {
        const activeUser = await api.fetchCurrentUser();
        if (activeUser) {
          setUser(activeUser);
          setScreenState('workspace');
        }
      }
    };
    checkSession();
  }, []);

  // Listen for 401 unauthorized session expiration events
  useEffect(() => {
    const handleUnauthorized = () => {
      storage.clearSession();
      setUser({
        name: 'Alexander Vance',
        email: 'executive@company.com',
        role: 'Enterprise AI Procurement Director'
      });
      setScreenState('auth');
    };
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, []);

  const handleLogout = async () => {
    playGlassTap();
    await api.logout();
    setUser({
      name: 'Alexander Vance',
      email: 'executive@company.com',
      role: 'Enterprise AI Procurement Director'
    });
    setScreenState('welcome');
  };


  // Global Keyboard Navigation Listeners (Escape -> Dashboard, Cmd+K -> Universal Search)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && screenState === 'workspace') {
        playGlassTap();
        setActiveTab('dashboard');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [screenState]);

  const runPipeline = async (query) => {
    setSearchQuery(query);
    setLoading(true);
    try {
      const data = await api.runFullPipeline(query, 'Assertive', 'English', 'Flexible');
      setPipelineData(data);
    } catch (e) {
      console.warn("Using default demonstration state for pipeline:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = (userData) => {
    setUser(userData);
    if (userData && userData.requires_verification) {
      setScreenState('verification');
    } else {
      setScreenState('workspace'); // Instant navigation to Dashboard for verified users!
    }
  };

  const handleVerificationComplete = () => {
    setScreenState('workspace'); // Instant navigation to Dashboard after verification!
  };


  const handleOnboardingComplete = () => {
    setScreenState('location_permission');
  };

  const handleLocationGranted = (coords) => {
    setUserLocation(coords);
    setScreenState('workspace');
  };

  const handleLocationDenied = () => {
    setScreenState('workspace');
  };

  // Render Splash Screen
  if (screenState === 'splash') {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }


  // Render Welcome Screen
  if (screenState === 'welcome') {
    return <WelcomeScreen onBegin={() => setScreenState('auth')} />;
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2F2F2F] font-sans flex antialiased selection:bg-[#C6A164] selection:text-white">
      
      {/* Auth Modal (Google, Apple, Microsoft, Passkeys, Face ID) */}
      <AuthModal
        isOpen={screenState === 'auth'}
        onClose={() => setScreenState('welcome')}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* Account Verification Modal */}
      <AccountVerificationModal
        isOpen={screenState === 'verification'}
        userEmail={user.email}
        devOtpCode={user.devOtpCode}
        onComplete={handleVerificationComplete}
        onBack={() => setScreenState('auth')}
      />




      {/* Onboarding 4-Step Wizard */}
      <OnboardingWizard
        isOpen={screenState === 'onboarding'}
        onComplete={handleOnboardingComplete}
      />

      {/* Precise Location Permission Modal */}
      <LocationPermissionModal
        isOpen={screenState === 'location_permission'}
        onClose={() => setScreenState('workspace')}
        onLocationGranted={handleLocationGranted}
        onLocationDenied={handleLocationDenied}
      />

      {/* Universal Search Modal (Cmd + K) */}
      <UniversalSearchModal
        isOpen={isSearchOpen}
        onClose={setIsSearchOpen}
        onSelectResult={(query) => {
          runPipeline(query);
          setActiveTab('studio');
        }}
      />

      {/* Interactive Map Modal */}
      <InteractiveMapModal
        isOpen={isMapOpen}
        onClose={setIsMapOpen}
        userLocation={userLocation}
        searchQuery={searchQuery}
      />


      {/* Persistent Floating AI Concierge Sphere */}
      {screenState === 'workspace' && (
        <AIConciergeSphere onRunAction={runPipeline} />
      )}

      {/* Main Operating System Workspace */}
      {screenState === 'workspace' && (
        <div className="flex w-full min-h-screen">
          
          {/* Clean 7-Item Glass Sidebar */}
          <Sidebar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
            onLogout={handleLogout}
          />


          {/* Main Content View Container */}
          <div className="flex-1 flex flex-col min-w-0">
            
            {/* Top Floating Navigation Header */}
            <Header
              activeTab={activeTab}
              user={user}
              onNavigate={setActiveTab}
              onOpenSearch={setIsSearchOpen}
              onOpenMap={setIsMapOpen}
            />

            {/* View Switching */}
            <main className="flex-1 p-6 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
              
              {activeTab === 'dashboard' && (
                <DashboardView
                  user={user}
                  onNavigate={setActiveTab}
                  onSearch={(q) => {
                    runPipeline(q);
                    setActiveTab('deal_finder');
                  }}
                  onOpenMissionControl={() => setActiveTab('mission_control')}
                />
              )}

              {activeTab === 'deal_finder' && (
                <DealFinderView
                  onRunSearch={(q) => {
                    runPipeline(q);
                    setActiveTab('studio');
                  }}
                />
              )}

              {activeTab === 'studio' && (
                <NegotiationStudioView pipelineData={pipelineData} />
              )}

              {activeTab === 'market_intel' && (
                <MarketplaceIntelView />
              )}

              {activeTab === 'mission_control' && (
                <MissionControl />
              )}

              {activeTab === 'analytics' && (
                <PriceAnalyticsView />
              )}

              {activeTab === 'reports' && (
                <ReportsView pipelineData={pipelineData} />
              )}

              {activeTab === 'history' && (
                <HistoryView
                  onSelectProduct={(name) => {
                    runPipeline(name);
                    setActiveTab('studio');
                  }}
                />
              )}

              {activeTab === 'notifications' && (
                <NotificationsView />
              )}

              {activeTab === 'profile' && (
                <ProfileView user={user} />
              )}

              {activeTab === 'settings' && (
                <SettingsView />
              )}

            </main>

          </div>

        </div>
      )}

    </div>
  );
}
