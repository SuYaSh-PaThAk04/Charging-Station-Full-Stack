import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Button } from "@/components/ui/button"; // Make sure this component exists in your project

const ChargerList = () => {
  const [chargers, setChargers] = useState([]);
  const [filteredChargers, setFilteredChargers] = useState([]);
  const [filterInputs, setFilterInputs] = useState({ status: '', powerOutput: '', connectorType: '' });
  const [filters, setFilters] = useState({ status: '', powerOutput: '', connectorType: '' });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch charger data
useEffect(() => {
  const token = localStorage.getItem("token"); // Or wherever you store it
  axios.get("http://localhost:4000/api/chargers/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    }
  })
    .then(res => {
      setChargers(res.data);
      setFilteredChargers(res.data);
      setLoading(false);
    })
    .catch(err => {
      console.error(err);
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    });
}, []);


  // Apply filters when 'filters' state changes
  useEffect(() => {
    const { status, powerOutput, connectorType } = filters;
    const results = chargers.filter(c =>
      (!status || c.status === status) &&
      (!powerOutput || c.powerOutput === powerOutput) &&
      (!connectorType || c.connectorType === connectorType)
    );
    setFilteredChargers(results);
  }, [filters, chargers]);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-semibold">All Chargers</h2>

      {/* Filter Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label>Status</Label>
          <Select onValueChange={val => setFilterInputs(prev => ({ ...prev, status: val }))}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="occupied">Occupied</SelectItem> {/* corrected from 'busy' */}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Power Output</Label>
          <Input
            type="text"
            placeholder="e.g. 150kW"
            onChange={e => setFilterInputs(prev => ({ ...prev, powerOutput: e.target.value }))}
          />
        </div>

        <div>
          <Label>Connector Type</Label>
          <Input
            type="text"
            placeholder="e.g. Type2"
            onChange={e => setFilterInputs(prev => ({ ...prev, connectorType: e.target.value }))}
          />
        </div>
      </div>

      {/* Apply Filters Button */}
      <Button onClick={() => setFilters(filterInputs)}>Apply Filters</Button>

      {/* Show loading or error */}
      {loading && <p>Loading chargers...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {/* Charger List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredChargers.length > 0 ? (
          filteredChargers.map(charger => (
            <Card key={charger._id}>
              <CardContent className="space-y-2 p-4">
                <h3 className="text-xl font-bold">{charger.name}</h3>
                <p><strong>Status:</strong> {charger.status}</p>
                <p><strong>Location:</strong> {charger.location}</p>
                <p><strong>Power:</strong> {charger.powerOutput}</p>
                <p><strong>Connector:</strong> {charger.connectorType}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          !loading && <p>No chargers found matching the filters.</p>
        )}
      </div>
    </div>
  );
};

export default ChargerList;
