import React, { useState, useEffect } from 'react';
import { 
  QrCode, 
  Copy, 
  CheckCircle, 
  Wallet, 
  Clock, 
  Shield, 
  ArrowRight,
  RefreshCw,
  Download,
  Share2,
  DollarSign,
  CreditCard,
  Smartphone,
  Globe,
  Settings,
  Info
} from 'lucide-react';

const QRCodeGenerator = () => {
  const [amount, setAmount] = useState('');
  const [currency, setCurrency] = useState('USDT');
  const [description, setDescription] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);
  const [paymentAddress, setPaymentAddress] = useState('');
  const [copied, setCopied] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState('pending');
  const [timeRemaining, setTimeRemaining] = useState(900); // 15 minutes

  // Simulate QR code generation
  const generateQRCode = async () => {
    if (!amount || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setIsGenerating(true);
    
    // Simulate API call delay
    setTimeout(() => {
      const mockAddress = `0x742d35Cc6634C0532925a3b8D49` + Math.random().toString(36).substr(2, 9);
      setPaymentAddress(mockAddress);
      setQrGenerated(true);
      setIsGenerating(false);
      setPaymentStatus('awaiting');
      
      // Start countdown timer
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            setPaymentStatus('expired');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }, 2000);
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(paymentAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const resetPayment = () => {
    setQrGenerated(false);
    setPaymentAddress('');
    setAmount('');
    setDescription('');
    setPaymentStatus('pending');
    setTimeRemaining(900);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currencies = [
    { code: 'USDT', name: 'Tether', icon: '₮' },
    { code: 'BTC', name: 'Bitcoin', icon: '₿' },
    { code: 'ETH', name: 'Ethereum', icon: 'Ξ' },
    { code: 'BNB', name: 'Binance Coin', icon: 'BNB' }
  ];

  // Mock QR Code SVG (in real app, use a QR code library)
  const QRCodeSVG = () => (
    <svg className="w-full h-full" viewBox="0 0 200 200" fill="none">
      <rect width="200" height="200" fill="white" rx="8"/>
      {/* Mock QR pattern */}
      {Array.from({ length: 15 }, (_, i) => 
        Array.from({ length: 15 }, (_, j) => (
          <rect
            key={`${i}-${j}`}
            x={10 + j * 12}
            y={10 + i * 12}
            width="10"
            height="10"
            fill={Math.random() > 0.5 ? "#1f2937" : "transparent"}
          />
        ))
      )}
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-800 via-blue-700 to-purple-700 bg-clip-text text-transparent">
                Payment Interface
              </h2>
              <p className="text-gray-600 text-sm md:text-base">
                Generate secure QR codes for crypto payments
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Payment Form */}
          <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 md:p-8 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-800">Create Payment Request</h3>
              <div className="flex space-x-2">
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200">
                  <Settings className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200">
                  <Info className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Amount *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                    disabled={qrGenerated}
                  />
                </div>
              </div>

              {/* Currency Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Currency
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {currencies.map((curr) => (
                    <button
                      key={curr.code}
                      onClick={() => setCurrency(curr.code)}
                      disabled={qrGenerated}
                      className={`p-3 rounded-lg border-2 transition-all duration-300 ${
                        currency === curr.code
                          ? 'border-blue-500 bg-blue-50 text-blue-600'
                          : 'border-gray-300 bg-white text-gray-600 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <div className="text-lg font-bold">{curr.icon}</div>
                      <div className="text-xs mt-1">{curr.code}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description (Optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Payment for services..."
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 resize-none"
                  disabled={qrGenerated}
                />
              </div>

              {/* Generate Button */}
              {!qrGenerated && (
                <button
                  onClick={generateQRCode}
                  disabled={isGenerating || !amount}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-blue-500/25 disabled:cursor-not-allowed"
                >
                  {isGenerating ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <QrCode className="w-5 h-5" />
                  )}
                  <span>{isGenerating ? 'Generating...' : 'Generate QR Code'}</span>
                </button>
              )}

              {/* Reset Button */}
              {qrGenerated && (
                <button
                  onClick={resetPayment}
                  className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center space-x-2 border border-gray-300"
                >
                  <RefreshCw className="w-5 h-5" />
                  <span>Create New Payment</span>
                </button>
              )}
            </div>
          </div>

          {/* QR Code Display */}
          <div className="bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 md:p-8 shadow-xl">
            {!qrGenerated ? (
              <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center">
                <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <QrCode className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Generate</h3>
                <p className="text-gray-600 max-w-sm">
                  Enter payment details and click "Generate QR Code" to create a secure payment request
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Payment Status */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`w-3 h-3 rounded-full ${
                      paymentStatus === 'awaiting' ? 'bg-yellow-500 animate-pulse' :
                      paymentStatus === 'confirmed' ? 'bg-green-500' :
                      'bg-red-500'
                    }`}></div>
                    <span className="text-sm font-medium text-gray-800 capitalize">
                      {paymentStatus === 'awaiting' ? 'Awaiting Payment' :
                       paymentStatus === 'confirmed' ? 'Payment Confirmed' :
                       'Payment Expired'}
                    </span>
                  </div>
                  {paymentStatus === 'awaiting' && (
                    <div className="flex items-center space-x-2 text-yellow-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-mono">{formatTime(timeRemaining)}</span>
                    </div>
                  )}
                </div>

                {/* QR Code */}
                <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-200">
                  <div className="w-full aspect-square max-w-xs mx-auto">
                    <QRCodeSVG />
                  </div>
                </div>

                {/* Payment Details */}
                <div className="space-y-4">
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600 text-sm">Amount</span>
                      <span className="text-gray-800 font-semibold">{amount} {currency}</span>
                    </div>
                    {description && (
                      <div className="flex justify-between items-start">
                        <span className="text-gray-600 text-sm">Description</span>
                        <span className="text-gray-800 text-right max-w-[200px] truncate">{description}</span>
                      </div>
                    )}
                  </div>

                  {/* Wallet Address */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Address
                    </label>
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-3 py-2">
                        <span className="text-gray-800 text-sm font-mono break-all">
                          {paymentAddress}
                        </span>
                      </div>
                      <button
                        onClick={copyToClipboard}
                        className="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors duration-200 shadow-md"
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    {copied && (
                      <p className="text-green-600 text-xs mt-1">Address copied to clipboard!</p>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <button className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors duration-200 border border-gray-300">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-lg transition-colors duration-200 border border-gray-300">
                    <Share2 className="w-4 h-4" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                </div>

                {/* Payment Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                  <div className="flex items-start space-x-3">
                    <Smartphone className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <h4 className="text-blue-700 font-medium text-sm mb-1">How to Pay</h4>
                      <ul className="text-blue-600 text-xs space-y-1">
                        <li>• Scan QR code with your crypto wallet</li>
                        <li>• Or copy the address and send manually</li>
                        <li>• Payment will be confirmed automatically</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Security Notice */}
        <div className="mt-8 bg-white/60 backdrop-blur-lg border border-gray-200 rounded-xl p-4 shadow-lg">
          <div className="flex items-center space-x-3">
            <Shield className="w-5 h-5 text-green-600" />
            <div>
              <span className="text-green-700 font-medium text-sm">Secure Payment</span>
              <p className="text-gray-600 text-xs">
                All transactions are secured by blockchain technology. Your payment details are never stored on our servers.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QRCodeGenerator;