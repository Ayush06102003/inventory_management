import React, { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useParams } from 'react-router-dom'
import { ABI } from '../utils/abi'

const Department = () => {
  const { departmentAddress } = useParams()
  const [departmentData, setDepartmentData] = useState(null)
  const [balance, setBalance] = useState(0)
  const [amount, setAmount] = useState(0)
  const [address, setAddress] = useState('')
  const [statuses, setStatuses] = useState([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const contract = new ethers.Contract(import.meta.env.VITE_CONTRACT_ADDRESS, ABI, provider)

        const data = await contract.getDepartmentData(departmentAddress)
        setDepartmentData(Object.values(data))

        // Fetch statuses in parallel
        const statusPromises = data[3].map((request) =>
          contract.requestStatus(departmentAddress, request)
        )

        const statusResults = await Promise.all(statusPromises)
        setStatuses(statusResults)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [departmentAddress])

  const formatAddress = (address) => {
    return `${address.slice(0, 6)} ... ${address.slice(-4)}`
  }

  const handleAddAdmin = async () => {
    if (!address) {
      alert('Please enter an address')
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(import.meta.env.VITE_CONTRACT_ADDRESS, ABI, signer)

      const tx = await contract.setDepartmentAdmin(departmentAddress, address, departmentData[2])
      await tx.wait()

      console.log('Admin added:', tx.hash)
      window.location.reload()
    } catch (error) {
      console.error('Error adding admin:', error)
    }
  }

  return (
    <div>
      {departmentData && (
        <div className='p-6'>
          <h2 className='text-3xl font-bold'>{departmentData[2]}</h2>
          <div className='mt-4'>
            <h3 className='text-xl'>Admins:</h3>
            <ul>
              {departmentData[0].map((admin, index) => (
                <li key={index}>{formatAddress(admin)}</li>
              ))}
            </ul>
          </div>

          <h3 className='text-xl mt-6'>Requests:</h3>
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th>Amount (ETH)</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {departmentData[3].map((request, index) => (
                <tr key={index}>
                  <td>{request.toString()}</td>
                  <td>{statuses[index] ? 'Approved' : 'Pending'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default Department
