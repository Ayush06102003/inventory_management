import React, { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { ABI } from '../utils/abi'

const AddDepartment = () => {
  const [departments, setDepartments] = useState(null)
  const [depName, setDepName] = useState('')
  const [depAddress, setDepAddress] = useState('')
  const [depAdmin, setDepAdmin] = useState('')

  useEffect(() => {
    const getDepartments = async () => {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        const contract = new ethers.Contract(import.meta.env.VITE_CONTRACT_ADDRESS, ABI, provider)
        const departmentAddresses = await contract.getAllDepartments()
        setDepartments(Object.values(departmentAddresses))
      } catch (error) {
        console.error('Error fetching departments:', error)
      }
    }

    getDepartments()
  }, [])

  const handleAddDepartment = async () => {
    if (!depName || !depAddress || !depAdmin) {
      alert('Please fill in all fields!')
      return
    }

    try {
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const contract = new ethers.Contract(import.meta.env.VITE_CONTRACT_ADDRESS, ABI, signer)

      const tx = await contract.setDepartmentAdmin(depAddress, depAdmin, depName)
      await tx.wait()

      console.log('Transaction hash:', tx.hash)
      window.location.reload()
    } catch (error) {
      console.error('Error adding department:', error)
    }
  }

  const formatAddress = (address) => {
    return `${address.slice(0, 7)} ... ${address.slice(-5)}`
  }

  return (
    <div className="wrapper">
      <div className="flex flex-col bg-white p-6 rounded-xl justify-center items-center mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800">Departments</h2>

        <div className="my-4">
          <button
            type="button"
            className="py-3 px-4 text-sm font-semibold rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            data-hs-overlay="#add-department-modal"
          >
            + Add Department
          </button>
        </div>

        <div id="add-department-modal" className="hs-overlay hidden w-full h-full fixed top-0 start-0 z-50 overflow-auto">
          <div className="hs-overlay-open:opacity-100 opacity-0 transition-all sm:max-w-lg sm:w-full m-3 sm:mx-auto min-h-[calc(100%-3.5rem)] flex items-center">
            <div className="bg-white border shadow-sm rounded-xl p-6 w-full">
              <h3 className="text-lg font-bold">Add Department</h3>
              <div className="mt-4">
                <input
                  type="text"
                  placeholder="Department Name"
                  className="w-full p-3 border rounded-lg mb-2"
                  onChange={(e) => setDepName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Department Address"
                  className="w-full p-3 border rounded-lg mb-2"
                  onChange={(e) => setDepAddress(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Admin Address"
                  className="w-full p-3 border rounded-lg"
                  onChange={(e) => setDepAdmin(e.target.value)}
                />
              </div>
              <div className="flex justify-end mt-4">
                <button className="px-4 py-2 bg-gray-200 rounded-lg" data-hs-overlay="#add-department-modal">Cancel</button>
                <button className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-lg" onClick={handleAddDepartment}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>

        <table className="min-w-full divide-y divide-gray-200 mt-6">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-medium text-gray-500 uppercase">Address</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {!departments && <tr><td>Loading...</td></tr>}
            {departments?.map((dept, index) => (
              <tr key={index} className="hover:bg-gray-100">
                <td className="px-6 py-4">{formatAddress(dept)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AddDepartment
