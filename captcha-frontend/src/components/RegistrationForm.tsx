import { useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import axios from 'axios'

const API_URL = '/api'

interface CaptchaResponse {
  id: string
  image: string
}

interface RegistrationData {
  username: string
  email: string
  password: string
  captchaId: string
  userInput: string
}

interface RegistrationResponse {
  success: boolean
  message: string
}

interface FormData {
  username: string
  email: string
  password: string
  confirmPassword: string
  userInput: string
}

export default function RegistrationForm() {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    userInput: '',
  })
  const [error, setError] = useState<string | null>(null)

  const { data: captcha, refetch: refreshCaptcha } = useQuery<CaptchaResponse>({
    queryKey: ['captcha'],
    queryFn: async () => {
      const response = await fetch(`${API_URL}/captcha/generate`)
      return response.json()
    },
  })

  const verifyCaptchaMutation = useMutation({
    mutationFn: async ({ captchaId, userInput }: { captchaId: string; userInput: string }) => {
      const response = await axios.post<{ valid: boolean }>(`${API_URL}/captcha/verify`, {
        captchaId,
        userInput
      })
      return response.data
    }
  })

  const registrationMutation = useMutation({
    mutationFn: async (data: RegistrationData) => {
      const response = await axios.post<RegistrationResponse>(`${API_URL}/auth/register`, data)
      return response.data
    },
    onSuccess: (data: RegistrationResponse) => {
      if (data.success) {
        // Reset form and show success message
        setFormData({
          username: '',
          email: '',
          password: '',
          confirmPassword: '',
          userInput: '',
        })
        setError(null)
        refreshCaptcha()
      } else {
        setError(data.message)
        refreshCaptcha()
      }
    },
    onError: (error: unknown) => {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'Registration failed')
      } else {
        setError('Registration failed. Please try again.')
      }
      refreshCaptcha()
    },
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    // Validate password strength
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long')
      return
    }

    if (!captcha?.id) {
      setError('Please wait for CAPTCHA to load')
      return
    }

    try {
      const verifyResult = await verifyCaptchaMutation.mutateAsync({
        captchaId: captcha.id,
        userInput: formData.userInput
      })

      if (!verifyResult.valid) {
        setError('Invalid CAPTCHA. Please try again.')
        refreshCaptcha()
        return
      }

      registrationMutation.mutate({
        username: formData.username,
        email: formData.email,
        password: formData.password,
        captchaId: captcha.id,
        userInput: formData.userInput,
      })
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || 'CAPTCHA verification failed')
      } else {
        setError('CAPTCHA verification failed. Please try again.')
      }
      refreshCaptcha()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev: FormData) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRefreshCaptcha = () => {
    setFormData((prev: FormData) => ({ ...prev, userInput: '' }))
    refreshCaptcha()
  }

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Create an Account</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {captcha?.image && (
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              CAPTCHA Verification
            </label>
            <div className="flex items-center space-x-4">
              <div
                className="h-12 w-auto border border-gray-300 rounded-lg"
                dangerouslySetInnerHTML={{ __html: captcha.image }}
              />
              <button
                type="button"
                onClick={handleRefreshCaptcha}
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                Refresh
              </button>
            </div>
            <input
              type="text"
              name="userInput"
              value={formData.userInput}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Enter CAPTCHA text"
              required
            />
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={registrationMutation.isPending || verifyCaptchaMutation.isPending}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
        >
          {registrationMutation.isPending || verifyCaptchaMutation.isPending ? 'Processing...' : 'Create Account'}
        </button>
      </form>
    </div>
  )
} 