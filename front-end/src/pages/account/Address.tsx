import React, { useEffect, useState } from "react";
import { getProvinces, getDistrictsByProvince, getWardsByDistrict } from "../../apis/user";
interface Province {
  code: number;
  name: string;
}

interface District {
  code: number;
  name: string;
}

interface Ward {
  code: number;
  name: string;
}

const Address: React.FC = () => {
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [districts, setDistricts] = useState<District[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);

  const [selectedProvince, setSelectedProvince] = useState<number | null>(null);
  const [selectedDistrict, setSelectedDistrict] = useState<number | null>(null);
  const [selectedWard, setSelectedWard] = useState<number | null>(null);

  const [specificAddress, setSpecificAddress] = useState<string>("");

  // Fetch provinces when component mounts
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const data = await getProvinces();
        setProvinces(data);
      } catch (error) {
        console.error("Failed to fetch provinces:", error);
      }
    };
    fetchProvinces();
  }, []);

  // Fetch districts when a province is selected
  useEffect(() => {
    const fetchDistricts = async () => {
      if (selectedProvince) {
        try {
          const data = await getDistrictsByProvince(selectedProvince);
          setDistricts(data);
          setWards([]); // Reset wards when province changes
        } catch (error) {
          console.error("Error fetching districts:", error);
        }
      }
    };
    fetchDistricts();
  }, [selectedProvince]);

  // Fetch wards when a district is selected
  useEffect(() => {
    const fetchWards = async () => {
      if (selectedDistrict) {
        try {
          const data = await getWardsByDistrict(selectedDistrict);
          setWards(data);
        } catch (error) {
          console.error("Error fetching wards:", error);
        }
      }
    };
    fetchWards();
  }, [selectedDistrict]);

  const handleSaveChanges = (event: React.FormEvent) => {
    event.preventDefault();
    // Implement your logic to handle the form submission
    const address = {
      province: provinces.find((prov) => prov.code === selectedProvince)?.name,
      district: districts.find((dist) => dist.code === selectedDistrict)?.name,
      ward: wards.find((ward) => ward.code === selectedWard)?.name,
      specificAddress,
    };
    console.log("Address:", address);
  };

  return (
    <div className="flex justify-center relative">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-5xl">
        <h2 className="text-lg text-purple-700 font-bold mb-6">SỔ ĐỊA CHỈ</h2>
        <h4 className="text-lg font-semibold mb-4">Địa chỉ nhận hàng</h4>
        {/* Form Fields */}
        <form onSubmit={handleSaveChanges}>
          {/* Province Select */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Tỉnh/TP *</label>
            <select
              value={selectedProvince ?? ""}
              onChange={(e) => setSelectedProvince(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
            >
              <option value="">Vui lòng chọn</option>
              {provinces.map((province) => (
                <option key={province.code} value={province.code}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          {/* District Select */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Quận/Huyện *</label>
            <select
              value={selectedDistrict ?? ""}
              onChange={(e) => setSelectedDistrict(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
              disabled={!selectedProvince}
            >
              <option value="">Vui lòng chọn</option>
              {districts.map((district) => (
                <option key={district.code} value={district.code}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ward Select */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Xã/Phường *</label>
            <select
              value={selectedWard ?? ""}
              onChange={(e) => setSelectedWard(Number(e.target.value))}
              className="w-full border border-gray-300 rounded px-4 py-2"
              required
              disabled={!selectedDistrict}
            >
              <option value="">Vui lòng chọn</option>
              {wards.map((ward) => (
                <option key={ward.code} value={ward.code}>
                  {ward.name}
                </option>
              ))}
            </select>
          </div>

          {/* Specific Address */}
          <div className="mb-4">
            <label className="block font-medium mb-2">Địa chỉ nhận *</label>
            <input
              type="text"
              value={specificAddress}
              onChange={(e) => setSpecificAddress(e.target.value)}
              className="w-full border border-gray-300 rounded px-4 py-2"
              placeholder="Nhập địa chỉ cụ thể"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-red-600 text-white font-bold rounded px-6 py-2 mt-2"
            >
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Address;
