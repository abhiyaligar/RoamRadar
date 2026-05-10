# Database Schema - Traveloop

This schema is designed for PostgreSQL using SQLAlchemy ORM (and Alembic for migrations). It heavily utilizes relational concepts to handle complex multi-city itineraries and budget tracking.

## 1. Entity-Relationship Overview

- **User** (1:N) **Trip**
- **Trip** (1:N) **Stop**
- **Stop** (1:N) **Activity**
- **Trip** (1:N) **TripShare**
- **Trip** (1:N) **PackingItem**
- **Trip** (1:N) **Note**

## 2. Table Definitions

### `users`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Unique user identifier |
| `email` | VARCHAR | UNIQUE, NOT NULL | User login email |
| `hashed_password` | VARCHAR | NOT NULL | Password hash |
| `full_name` | VARCHAR | NOT NULL | User's full name |
| `profile_picture_url`| VARCHAR | NULL | S3 URL to avatar |
| `created_at` | TIMESTAMP | DEFAULT NOW() | Account creation time |

### `trips`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Unique trip identifier |
| `user_id` | UUID | FOREIGN KEY (`users.id`) | Owner of the trip |
| `name` | VARCHAR | NOT NULL | e.g. "Euro Trip 2026" |
| `description` | TEXT | NULL | Context about the trip |
| `start_date` | DATE | NOT NULL | Trip start |
| `end_date` | DATE | NOT NULL | Trip end |
| `cover_image_url` | VARCHAR | NULL | S3 URL for trip cover |
| `is_public` | BOOLEAN | DEFAULT false | For public sharing link |
| `public_link_id` | VARCHAR | UNIQUE, NULL | Short hash for public sharing |
| `created_at` | TIMESTAMP | DEFAULT NOW() | |

### `stops`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Unique stop identifier |
| `trip_id` | UUID | FOREIGN KEY (`trips.id`) | Belonging trip |
| `city_name` | VARCHAR | NOT NULL | e.g. "Paris" |
| `country` | VARCHAR | NOT NULL | e.g. "France" |
| `latitude` | FLOAT | NOT NULL | For MapBox rendering |
| `longitude` | FLOAT | NOT NULL | For MapBox rendering |
| `arrival_date` | DATE | NOT NULL | |
| `departure_date` | DATE | NOT NULL | |
| `order_index` | INTEGER | NOT NULL | Order in itinerary |

### `activities`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | Unique activity ID |
| `stop_id` | UUID | FOREIGN KEY (`stops.id`) | Belonging stop |
| `name` | VARCHAR | NOT NULL | e.g. "Eiffel Tower" |
| `category` | VARCHAR | NOT NULL | Transport, Stay, Meal, Activity |
| `cost_amount` | DECIMAL | DEFAULT 0.00 | Cost estimation |
| `currency` | VARCHAR | DEFAULT 'USD' | |
| `scheduled_time` | TIMESTAMP | NULL | Specific time if planned |
| `notes` | TEXT | NULL | |

### `trip_shares` (Scalable Social Sharing)
*Designed to be scalable for future "collaborator/editor" features.*
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | |
| `trip_id` | UUID | FOREIGN KEY (`trips.id`) | The shared trip |
| `shared_with_user_id`| UUID | FOREIGN KEY (`users.id`) | Nullable if shared via email |
| `shared_with_email` | VARCHAR | NULL | If the user is not registered |
| `permission_level` | VARCHAR | DEFAULT 'viewer' | ENUM: 'viewer', 'editor' |
| `created_at` | TIMESTAMP | DEFAULT NOW() | |

### `packing_items`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | |
| `trip_id` | UUID | FOREIGN KEY (`trips.id`) | |
| `item_name` | VARCHAR | NOT NULL | e.g. "Passport" |
| `category` | VARCHAR | DEFAULT 'General' | e.g. "Documents", "Clothes" |
| `is_packed` | BOOLEAN | DEFAULT false | |

### `notes`
| Column | Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | PRIMARY KEY | |
| `trip_id` | UUID | FOREIGN KEY (`trips.id`) | |
| `stop_id` | UUID | FOREIGN KEY (`stops.id`) | Optional, if note is city-specific |
| `content` | TEXT | NOT NULL | |
| `created_at` | TIMESTAMP | DEFAULT NOW() | |

## 3. Database Migration Strategy
- Use **Alembic** to manage schema migrations.
- Command to initialize: `alembic init alembic`
- Command to auto-generate migration: `alembic revision --autogenerate -m "Init tables"`
- Command to apply: `alembic upgrade head`
