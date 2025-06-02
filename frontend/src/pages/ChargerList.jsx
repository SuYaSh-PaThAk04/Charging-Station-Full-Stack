import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import handleDelete from '../components/DeleteCharger';
import NavBar from "../components/NavBar";
import { CreateCharger } from './CreateCharger';

const ChargerList = () => {
  const [chargers, setChargers] = useState([]);
  const [filteredChargers, setFilteredChargers] = useState([]);
  const [filters, setFilters] = useState({ status: '', powerOutput: '', connectorType: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchChargers = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please log in.");
        return;
      }

      const res = await axios.get("http://localhost:4000/api/chargers/all", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setChargers(res.data);
      setFilteredChargers(res.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching chargers:", err);
      setError(err.response?.data?.message || "Error fetching chargers.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChargers();
  }, [fetchChargers]);

  useEffect(() => {
    const { status, powerOutput, connectorType } = filters;
    const results = chargers.filter(c =>
      (!status || c.status === status) &&
      (!powerOutput || c.powerOutput.toLowerCase().includes(powerOutput.toLowerCase())) &&
      (!connectorType || c.connectorType.toLowerCase().includes(connectorType.toLowerCase()))
    );
    setFilteredChargers(results);
  }, [filters, chargers]);

  const onDelete = async (id) => {
    await handleDelete(id);
    fetchChargers();
  };

  const resetFilters = () => {
    setFilters({ status: '', powerOutput: '', connectorType: '' });
  };

  return (
    <>
      <NavBar />
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">All Chargers</h2>

          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-green-600 hover:bg-green-700">Create Charger</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Create a New Charger</DialogTitle>
              </DialogHeader>
              <CreateCharger onCreated={fetchChargers} />
              <DialogClose asChild>
                <Button variant="outline" className="mt-4 w-full">Close</Button>
              </DialogClose>
            </DialogContent>
          </Dialog>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label>Status</Label>
            <Select
              value={filters.status}
              onValueChange={val => setFilters(prev => ({ ...prev, status: val }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="occupied">Occupied</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Power Output</Label>
            <Input
              type="text"
              placeholder="e.g. 150kW"
              value={filters.powerOutput}
              onChange={e => setFilters(prev => ({ ...prev, powerOutput: e.target.value }))}
            />
          </div>

          <div>
            <Label>Connector Type</Label>
            <Input
              type="text"
              placeholder="e.g. Type2"
              value={filters.connectorType}
              onChange={e => setFilters(prev => ({ ...prev, connectorType: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex gap-4 solid-black-700 text-white-500">
          <Button onClick={resetFilters} variant="outline">Reset Filters</Button>
        </div>

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
                  {charger.locationName && (
                    <p><strong>Location:</strong> {charger.locationName }</p>
                  )}
                  <p><strong>Power:</strong> {charger.powerOutput}</p>
                  <p><strong>Connector:</strong> {charger.connectorType}</p>
                  <Button variant="destructive" onClick={() => onDelete(charger._id)}>Delete</Button>
                </CardContent>
              </Card>
            ))
          ) : (
            !loading && <p>No chargers found matching the filters.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default ChargerList;
