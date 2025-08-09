import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Card, 
  Heading, 
  Text, 
  TextField, 
  Button, 
  Flex, 
  Box,
  Separator,
  Callout
} from '@radix-ui/themes';

const Options: React.FC = () => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Load existing API key on component mount
    loadApiKey();
  }, []);

  const loadApiKey = async () => {
    try {
      const result = await chrome.storage.sync.get(['geminiApiKey']);
      if (result.geminiApiKey) {
        setApiKey(result.geminiApiKey);
      }
    } catch (error) {
      console.error('Failed to load API key:', error);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      await chrome.storage.sync.set({ geminiApiKey: apiKey.trim() });
      setMessage({ type: 'success', text: 'API key saved successfully!' });
    } catch (error) {
      console.error('Failed to save API key:', error);
      setMessage({ type: 'error', text: 'Failed to save API key. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleTest = async () => {
    if (!apiKey.trim()) {
      setMessage({ type: 'error', text: 'Please enter an API key first.' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'TEST_API_KEY',
        apiKey: apiKey.trim()
      });
      
      if (response.ok && response.data.isValid) {
        setMessage({ type: 'success', text: 'API key is valid and working!' });
      } else {
        setMessage({ type: 'error', text: 'API key is invalid. Please check your key and try again.' });
      }
    } catch (error) {
      console.error('Failed to test API key:', error);
      setMessage({ type: 'error', text: 'Failed to test API key. Please check your connection.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = async () => {
    try {
      await chrome.storage.sync.remove(['geminiApiKey']);
      setApiKey('');
      setMessage({ type: 'success', text: 'API key cleared successfully!' });
    } catch (error) {
      console.error('Failed to clear API key:', error);
      setMessage({ type: 'error', text: 'Failed to clear API key. Please try again.' });
    }
  };

  return (
    <Container size="2" p="6">
      <Box mb="6">
        <Heading size="6" mb="2">PromptHero Settings</Heading>
        <Text color="gray">
          Configure your API settings and preferences
        </Text>
      </Box>

      <Flex direction="column" gap="6">
        {/* API Configuration */}
        <Card>
          <Flex direction="column" gap="4">
            <Heading size="4">Gemini API Configuration</Heading>
            
            <Box>
              <Text size="2" weight="medium" mb="2" style={{ display: 'block' }}>
                API Key
              </Text>
              <TextField.Root
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your Gemini API key..."
                type="password"
                size="3"
              />
              <Text size="1" color="gray" mt="1" style={{ display: 'block' }}>
                Your API key is stored locally and never shared with third parties.
              </Text>
            </Box>

            <Flex gap="2">
              <Button 
                onClick={handleSave} 
                disabled={isLoading || !apiKey.trim()}
                style={{ flex: 1 }}
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
              <Button 
                variant="outline" 
                onClick={handleTest}
                disabled={isLoading || !apiKey.trim()}
                style={{ flex: 1 }}
              >
                {isLoading ? 'Testing...' : 'Test'}
              </Button>
              <Button 
                variant="soft" 
                color="red"
                onClick={handleClear}
                disabled={isLoading}
              >
                Clear
              </Button>
            </Flex>

            {message && (
              <Callout.Root color={message.type === 'success' ? 'green' : 'red'}>
                <Callout.Text>{message.text}</Callout.Text>
              </Callout.Root>
            )}
          </Flex>
        </Card>

        <Separator size="4" />

        {/* Help Section */}
        <Card>
          <Flex direction="column" gap="3">
            <Heading size="4">Getting Your API Key</Heading>
            
            <Text size="2">
              To use PromptHero, you'll need a Gemini API key from Google AI Studio:
            </Text>
            
            <Box pl="4">
              <Text size="2" style={{ display: 'block', marginBottom: '4px' }}>
                1. Visit{' '}
                <Text 
                  color="blue" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => chrome.tabs.create({ url: 'https://aistudio.google.com/app/apikey' })}
                >
                  Google AI Studio
                </Text>
              </Text>
              <Text size="2" style={{ display: 'block', marginBottom: '4px' }}>
                2. Sign in with your Google account
              </Text>
              <Text size="2" style={{ display: 'block', marginBottom: '4px' }}>
                3. Click "Create API Key"
              </Text>
              <Text size="2" style={{ display: 'block' }}>
                4. Copy the generated key and paste it above
              </Text>
            </Box>
          </Flex>
        </Card>

        {/* Privacy Notice */}
        <Card variant="surface">
          <Flex direction="column" gap="2">
            <Heading size="3">Privacy & Security</Heading>
            <Text size="2" color="gray">
              PromptHero prioritizes your privacy. Your API key and prompts are stored locally 
              on your device and are only used to make requests to Google's Gemini API. 
              No data is sent to any third-party servers or analytics services.
            </Text>
          </Flex>
        </Card>
      </Flex>
    </Container>
  );
};

export default Options;
