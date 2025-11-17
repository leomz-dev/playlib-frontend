
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Game, getGames, deleteGame, updateGame } from '../services/gameService';
import GameCard from '../components/GameCard';
import AddGameForm from '../components/AddGameForm';

// Types for our filters
interface Filters {
  searchTerm: string;
  genero: string;
  plataforma: string;
  completado: string;
}

export default function GameLibrary() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormVisible, setIsFormVisible] = useState(false);
  
  // State for filters
  const [filters, setFilters] = useState<Filters>({
    searchTerm: '',
    genero: '',
    plataforma: '',
    completado: ''
  });

  // Get unique values for filter options
  const uniqueGenres = useMemo(() => {
    const genres = new Set(games.map(game => game.genero));
    return Array.from(genres).sort();
  }, [games]);

  const uniquePlatforms = useMemo(() => {
    const platforms = new Set(games.map(game => game.plataforma));
    return Array.from(platforms).sort();
  }, [games]);

  const fetchGames = async () => {
    try {
      setLoading(true);
      const data = await getGames();
      setGames(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching games:', err);
      setError('No se pudieron cargar los juegos. Por favor, inténtalo de nuevo más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGames();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteGame(id);
      // Refresh the games list after successful deletion
      await fetchGames();
    } catch (err) {
      console.error('Error deleting game:', err);
      setError('No se pudo eliminar el juego. Por favor, inténtalo de nuevo.');
    }
  };


  const handleRatingChange = async (id: string, rating: number) => {
    try {
      await updateGame(id, { calificacion: rating });
      // Refresh the games list after successful update
      await fetchGames();
    } catch (err) {
      console.error('Error updating rating:', err);
      setError('No se pudo actualizar la calificación. Por favor, inténtalo de nuevo.');
    }
  };

  const handleGameAdded = () => {
    fetchGames();
    setIsFormVisible(false);
  };

  // Filter games based on search and filters
  const filteredGames = useMemo(() => {
    return games.filter(game => {
      // Search term filter
      const matchesSearch = game.titulo.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
                          game.descripcion?.toLowerCase().includes(filters.searchTerm.toLowerCase());
      
      // Genre filter
      const matchesGenre = !filters.genero || game.genero === filters.genero;
      
      // Platform filter
      const matchesPlatform = !filters.plataforma || game.plataforma === filters.plataforma;
      
      return matchesSearch && matchesGenre && matchesPlatform;
    });
  }, [games, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      searchTerm: '',
      genero: '',
      plataforma: '',
      completado: ''
    });
  };

  return (
    <div className="min-h-screen text-white p-6 md:p-8 scroll-mt-16 py-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 backdrop-blur-xl bg-black/20 border border-red-500/20 rounded-2xl p-6">
          <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-red-600 to-red-700 drop-shadow-[0_0_20px_rgba(220,38,38,0.5)]">Mi Biblioteca de Juegos</h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setIsFormVisible(!isFormVisible)}
              className="px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-500 hover:to-red-600 transition-all duration-300 shadow-[0_0_20px_rgba(220,38,38,0.4)] hover:shadow-[0_0_30px_rgba(220,38,38,0.6)] font-semibold"
            >
              {isFormVisible ? 'Cerrar Formulario' : 'Agregar Juego'}
            </button>
          </div>
        </div>

        {isFormVisible && (
          <div className="mb-8">
            <AddGameForm onGameAdded={handleGameAdded} />
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <button 
              onClick={fetchGames}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="text-red-500 hover:text-red-700">Reintentar</span>
            </button>
          </div>
        )}

        {/* Search and Filter Section */}
        <div className="mb-8 backdrop-blur-xl bg-black/30 border border-red-500/20 p-6 rounded-2xl shadow-[0_0_30px_rgba(220,38,38,0.2)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            {/* Search Input */}
            <div>
              <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-300 mb-1">
                Buscar por título
              </label>
              <input
                type="text"
                id="searchTerm"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleFilterChange}
                placeholder="Buscar juegos..."
                className="w-full px-4 py-3 bg-black/40 backdrop-blur-md border border-red-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              />
            </div>

            {/* Genre Filter */}
            <div>
              <label htmlFor="genero" className="block text-sm font-medium text-gray-300 mb-1">
                Género
              </label>
              <select
                id="genero"
                name="genero"
                value={filters.genero}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 bg-black/40 backdrop-blur-md border border-red-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              >
                <option value="">Todos los géneros</option>
                {uniqueGenres.map(genre => (
                  <option key={genre} value={genre}>
                    {genre}
                  </option>
                ))}
              </select>
            </div>

            {/* Platform Filter */}
            <div>
              <label htmlFor="plataforma" className="block text-sm font-medium text-gray-300 mb-1">
                Plataforma
              </label>
              <select
                id="plataforma"
                name="plataforma"
                value={filters.plataforma}
                onChange={handleFilterChange}
                className="w-full px-4 py-3 bg-black/40 backdrop-blur-md border border-red-500/30 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all"
              >
                <option value="">Todas las plataformas</option>
                {uniquePlatforms.map(platform => (
                  <option key={platform} value={platform}>
                    {platform}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Clear Filters Button */}
          <div className="flex justify-end">
            <button
              onClick={clearFilters}
              className="px-4 py-2 text-sm text-gray-300 hover:text-red-400 transition-colors backdrop-blur-md bg-white/5 rounded-lg border border-white/10 hover:border-red-500/30"
            >
              Limpiar filtros
            </button>
          </div>
        </div>

        {/* Results Count */}
        {!loading && !error && games.length > 0 && (
          <div className="mb-4 text-gray-400 text-sm">
            Mostrando {filteredGames.length} de {games.length} juegos
          </div>
        )}

        {!loading && !error && games.length === 0 && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-300">No hay juegos en tu biblioteca</h3>
            <p className="mt-1 text-gray-400">Comienza agregando un juego para verlo aquí</p>
          </div>
        )}

        {!loading && !error && games.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
            {filteredGames.length > 0 ? (
              filteredGames.map((game) => (
                <GameCard
                  key={game._id}
                  {...game}
                  onDelete={handleDelete}
                  onRatingChange={handleRatingChange}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-lg font-medium text-gray-300">No se encontraron juegos</h3>
                <p className="mt-1 text-gray-400">Intenta ajustar los filtros de búsqueda</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
