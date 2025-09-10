-- Populate categories table with mock data
INSERT INTO categories (id, name, description) VALUES
('650e8400-e29b-41d4-a716-446655440001', 'Fiction', 'Literary works of imaginative narration, including novels and short stories that tell stories about imaginary characters and events.'),
('650e8400-e29b-41d4-a716-446655440002', 'Mystery', 'Stories involving puzzles, crimes, and investigations that need to be solved, often featuring detectives or amateur sleuths.'),
('650e8400-e29b-41d4-a716-446655440003', 'Romance', 'Stories focused on love and relationships, exploring the emotional journey between characters as they find love.'),
('650e8400-e29b-41d4-a716-446655440004', 'Science Fiction', 'Futuristic and speculative fiction that deals with advanced science and technology, space exploration, time travel, and parallel universes.'),
('650e8400-e29b-41d4-a716-446655440005', 'Biography', 'Life stories of real people, documenting their experiences, achievements, and impact on society.'),
('650e8400-e29b-41d4-a716-446655440006', 'Classic', 'Timeless literary works that have stood the test of time and continue to be relevant across generations.'),
('650e8400-e29b-41d4-a716-446655440007', 'Dystopian', 'Stories set in imaginary societies where something is terribly wrong, often exploring themes of oppression and social control.')
ON CONFLICT (id) DO NOTHING;
