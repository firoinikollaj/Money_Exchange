USE [master]
GO
CREATE DATABASE [CurrencyExchangeDb]
 CONTAINMENT = NONE
 ON  PRIMARY 
( NAME = N'CurrencyExchangeDb', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\CurrencyExchangeDb.mdf' , SIZE = 8192KB , MAXSIZE = UNLIMITED, FILEGROWTH = 65536KB )
 LOG ON 
( NAME = N'CurrencyExchangeDb_log', FILENAME = N'C:\Program Files\Microsoft SQL Server\MSSQL16.MSSQLSERVER\MSSQL\DATA\CurrencyExchangeDb_log.ldf' , SIZE = 8192KB , MAXSIZE = 2048GB , FILEGROWTH = 65536KB )
 WITH CATALOG_COLLATION = DATABASE_DEFAULT, LEDGER = OFF
GO
ALTER DATABASE [CurrencyExchangeDb] SET COMPATIBILITY_LEVEL = 160
GO
IF (1 = FULLTEXTSERVICEPROPERTY('IsFullTextInstalled'))
begin
EXEC [CurrencyExchangeDb].[dbo].[sp_fulltext_database] @action = 'enable'
end
GO
ALTER DATABASE [CurrencyExchangeDb] SET ANSI_NULL_DEFAULT OFF 
GO
ALTER DATABASE [CurrencyExchangeDb] SET ANSI_NULLS OFF 
GO
ALTER DATABASE [CurrencyExchangeDb] SET ANSI_PADDING OFF 
GO
ALTER DATABASE [CurrencyExchangeDb] SET ANSI_WARNINGS OFF 
GO
ALTER DATABASE [CurrencyExchangeDb] SET ARITHABORT OFF 
GO
ALTER DATABASE [CurrencyExchangeDb] SET AUTO_CLOSE OFF 
GO
ALTER DATABASE [CurrencyExchangeDb] SET AUTO_SHRINK OFF 
GO
ALTER DATABASE [CurrencyExchangeDb] SET AUTO_UPDATE_STATISTICS ON 
GO
ALTER DATABASE [CurrencyExchangeDb] SET CURSOR_CLOSE_ON_COMMIT OFF 
GO
ALTER DATABASE [CurrencyExchangeDb] SET CURSOR_DEFAULT  GLOBAL 
GO
ALTER DATABASE [CurrencyExchangeDb] SET CONCAT_NULL_YIELDS_NULL OFF 
GO
ALTER DATABASE [CurrencyExchangeDb] SET NUMERIC_ROUNDABORT OFF 
GO
ALTER DATABASE [CurrencyExchangeDb] SET QUOTED_IDENTIFIER OFF 
GO
ALTER DATABASE [CurrencyExchangeDb] SET RECURSIVE_TRIGGERS OFF 
GO
ALTER DATABASE [CurrencyExchangeDb] SET  ENABLE_BROKER 
GO
ALTER DATABASE [CurrencyExchangeDb] SET AUTO_UPDATE_STATISTICS_ASYNC OFF 
GO
ALTER DATABASE [CurrencyExchangeDb] SET DATE_CORRELATION_OPTIMIZATION OFF 
GO
ALTER DATABASE [CurrencyExchangeDb] SET TRUSTWORTHY OFF 
GO
ALTER DATABASE [CurrencyExchangeDb] SET ALLOW_SNAPSHOT_ISOLATION OFF 
GO
ALTER DATABASE [CurrencyExchangeDb] SET PARAMETERIZATION SIMPLE 
GO
ALTER DATABASE [CurrencyExchangeDb] SET READ_COMMITTED_SNAPSHOT OFF 
GO
ALTER DATABASE [CurrencyExchangeDb] SET HONOR_BROKER_PRIORITY OFF 
GO
ALTER DATABASE [CurrencyExchangeDb] SET RECOVERY FULL 
GO
ALTER DATABASE [CurrencyExchangeDb] SET  MULTI_USER 
GO
ALTER DATABASE [CurrencyExchangeDb] SET PAGE_VERIFY CHECKSUM  
GO
ALTER DATABASE [CurrencyExchangeDb] SET DB_CHAINING OFF 
GO
ALTER DATABASE [CurrencyExchangeDb] SET FILESTREAM( NON_TRANSACTED_ACCESS = OFF ) 
GO
ALTER DATABASE [CurrencyExchangeDb] SET TARGET_RECOVERY_TIME = 60 SECONDS 
GO
ALTER DATABASE [CurrencyExchangeDb] SET DELAYED_DURABILITY = DISABLED 
GO
ALTER DATABASE [CurrencyExchangeDb] SET ACCELERATED_DATABASE_RECOVERY = OFF  
GO
EXEC sys.sp_db_vardecimal_storage_format N'CurrencyExchangeDb', N'ON'
GO
ALTER DATABASE [CurrencyExchangeDb] SET QUERY_STORE = ON
GO
ALTER DATABASE [CurrencyExchangeDb] SET QUERY_STORE (OPERATION_MODE = READ_WRITE, CLEANUP_POLICY = (STALE_QUERY_THRESHOLD_DAYS = 30), DATA_FLUSH_INTERVAL_SECONDS = 900, INTERVAL_LENGTH_MINUTES = 60, MAX_STORAGE_SIZE_MB = 1000, QUERY_CAPTURE_MODE = AUTO, SIZE_BASED_CLEANUP_MODE = AUTO, MAX_PLANS_PER_QUERY = 200, WAIT_STATS_CAPTURE_MODE = ON)
GO
USE [CurrencyExchangeDb]
GO
CREATE USER [ITALY\asjhasa] FOR LOGIN [ITALY\asjhasa] WITH DEFAULT_SCHEMA=[dbo]
GO
CREATE USER [asjan] FOR LOGIN [asjan] WITH DEFAULT_SCHEMA=[dbo]
GO
ALTER ROLE [db_owner] ADD MEMBER [ITALY\asjhasa]
GO
ALTER ROLE [db_accessadmin] ADD MEMBER [ITALY\asjhasa]
GO
ALTER ROLE [db_securityadmin] ADD MEMBER [ITALY\asjhasa]
GO
ALTER ROLE [db_ddladmin] ADD MEMBER [ITALY\asjhasa]
GO
ALTER ROLE [db_backupoperator] ADD MEMBER [ITALY\asjhasa]
GO
ALTER ROLE [db_datareader] ADD MEMBER [ITALY\asjhasa]
GO
ALTER ROLE [db_datawriter] ADD MEMBER [ITALY\asjhasa]
GO
ALTER ROLE [db_denydatareader] ADD MEMBER [ITALY\asjhasa]
GO
ALTER ROLE [db_denydatawriter] ADD MEMBER [ITALY\asjhasa]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[AllCurrencies](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](10) NOT NULL,
	[Name] [nvarchar](100) NULL,
	[Symbol] [nvarchar](10) NULL,
	[CountryCode] [nvarchar](5) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[ConversionRates](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FromCurrencyId] [int] NOT NULL,
	[ToCurrencyId] [int] NOT NULL,
	[Rate] [decimal](18, 6) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Currencies](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Code] [nvarchar](10) NOT NULL,
	[CountryCode] [nvarchar](10) NOT NULL,
	[Symbol] [nvarchar](10) NULL,
	[Name] [nvarchar](100) NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Users](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Email] [nvarchar](256) NOT NULL,
	[PasswordHash] [nvarchar](500) NOT NULL,
	[Role] [nvarchar](50) NOT NULL,
	[CreatedAt] [datetime] NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [dbo].[AllCurrencies] ON 

INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (1, N'USD', N'United States Dollar', N'$', N'US')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (2, N'EUR', N'Euro', N'€', N'EU')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (3, N'JPY', N'Japanese Yen', N'¥', N'JP')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (4, N'GBP', N'British Pound', N'£', N'GB')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (5, N'AUD', N'Australian Dollar', N'A$', N'AU')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (6, N'CAD', N'Canadian Dollar', N'C$', N'CA')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (7, N'CHF', N'Swiss Franc', N'CHF', N'CH')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (8, N'CNY', N'Chinese Yuan', N'¥', N'CN')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (9, N'SEK', N'Swedish Krona', N'kr', N'SE')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (10, N'NZD', N'New Zealand Dollar', N'NZ$', N'NZ')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (11, N'INR', N'Indian Rupee', N'?', N'IN')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (12, N'RUB', N'Russian Ruble', N'?', N'RU')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (13, N'BRL', N'Brazilian Real', N'R$', N'BR')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (14, N'ZAR', N'South African Rand', N'R', N'ZA')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (15, N'SGD', N'Singapore Dollar', N'S$', N'SG')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (16, N'NOK', N'Norwegian Krone', N'kr', N'NO')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (17, N'MXN', N'Mexican Peso', N'$', N'MX')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (18, N'KRW', N'South Korean Won', N'?', N'KR')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (19, N'TRY', N'Turkish Lira', N'?', N'TR')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (20, N'HKD', N'Hong Kong Dollar', N'HK$', N'HK')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (21, N'DKK', N'Danish Krone', N'kr', N'DK')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (22, N'PLN', N'Polish Zloty', N'zl', N'PL')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (23, N'TWD', N'New Taiwan Dollar', N'NT$', N'TW')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (24, N'THB', N'Thai Baht', N'?', N'TH')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (25, N'MYR', N'Malaysian Ringgit', N'RM', N'MY')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (26, N'IDR', N'Indonesian Rupiah', N'Rp', N'ID')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (27, N'CZK', N'Czech Koruna', N'Kc', N'CZ')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (28, N'HUF', N'Hungarian Forint', N'Ft', N'HU')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (29, N'ILS', N'Israeli New Shekel', N'?', N'IL')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (30, N'AED', N'UAE Dirham', N'?.?', N'AE')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (31, N'SAR', N'Saudi Riyal', N'?', N'SA')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (32, N'ARS', N'Argentine Peso', N'$', N'AR')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (33, N'CLP', N'Chilean Peso', N'$', N'CL')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (34, N'PKR', N'Pakistani Rupee', N'?', N'PK')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (35, N'EGP', N'Egyptian Pound', N'£', N'EG')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (36, N'VND', N'Vietnamese Dong', N'?', N'VN')
INSERT [dbo].[AllCurrencies] ([Id], [Code], [Name], [Symbol], [CountryCode]) VALUES (37, N'BDT', N'Bangladeshi Taka', N'?', N'BD')
SET IDENTITY_INSERT [dbo].[AllCurrencies] OFF
GO
SET IDENTITY_INSERT [dbo].[ConversionRates] ON 

INSERT [dbo].[ConversionRates] ([Id], [FromCurrencyId], [ToCurrencyId], [Rate]) VALUES (9, 2, 3, CAST(0.870000 AS Decimal(18, 6)))
INSERT [dbo].[ConversionRates] ([Id], [FromCurrencyId], [ToCurrencyId], [Rate]) VALUES (10, 2, 4, CAST(180.150000 AS Decimal(18, 6)))
INSERT [dbo].[ConversionRates] ([Id], [FromCurrencyId], [ToCurrencyId], [Rate]) VALUES (11, 3, 2, CAST(1.140000 AS Decimal(18, 6)))
INSERT [dbo].[ConversionRates] ([Id], [FromCurrencyId], [ToCurrencyId], [Rate]) VALUES (12, 3, 4, CAST(205.220000 AS Decimal(18, 6)))
INSERT [dbo].[ConversionRates] ([Id], [FromCurrencyId], [ToCurrencyId], [Rate]) VALUES (13, 4, 2, CAST(0.005600 AS Decimal(18, 6)))
INSERT [dbo].[ConversionRates] ([Id], [FromCurrencyId], [ToCurrencyId], [Rate]) VALUES (14, 4, 3, CAST(0.004900 AS Decimal(18, 6)))
INSERT [dbo].[ConversionRates] ([Id], [FromCurrencyId], [ToCurrencyId], [Rate]) VALUES (141, 1, 2, CAST(0.870000 AS Decimal(18, 6)))
INSERT [dbo].[ConversionRates] ([Id], [FromCurrencyId], [ToCurrencyId], [Rate]) VALUES (142, 2, 1, CAST(1.150000 AS Decimal(18, 6)))
INSERT [dbo].[ConversionRates] ([Id], [FromCurrencyId], [ToCurrencyId], [Rate]) VALUES (143, 1, 3, CAST(0.760000 AS Decimal(18, 6)))
INSERT [dbo].[ConversionRates] ([Id], [FromCurrencyId], [ToCurrencyId], [Rate]) VALUES (144, 3, 1, CAST(1.300000 AS Decimal(18, 6)))
INSERT [dbo].[ConversionRates] ([Id], [FromCurrencyId], [ToCurrencyId], [Rate]) VALUES (145, 1, 4, CAST(156.480000 AS Decimal(18, 6)))
INSERT [dbo].[ConversionRates] ([Id], [FromCurrencyId], [ToCurrencyId], [Rate]) VALUES (146, 4, 1, CAST(0.006400 AS Decimal(18, 6)))
SET IDENTITY_INSERT [dbo].[ConversionRates] OFF
GO
SET IDENTITY_INSERT [dbo].[Currencies] ON 

INSERT [dbo].[Currencies] ([Id], [Code], [CountryCode], [Symbol], [Name]) VALUES (1, N'USD', N'us', N'$', N'US Dollar')
INSERT [dbo].[Currencies] ([Id], [Code], [CountryCode], [Symbol], [Name]) VALUES (2, N'EUR', N'eu', N'€', N'Euro')
INSERT [dbo].[Currencies] ([Id], [Code], [CountryCode], [Symbol], [Name]) VALUES (3, N'GBP', N'gb', N'£', N'British Pound')
INSERT [dbo].[Currencies] ([Id], [Code], [CountryCode], [Symbol], [Name]) VALUES (4, N'JPY', N'jp', N'¥', N'Japanese Yen')
SET IDENTITY_INSERT [dbo].[Currencies] OFF
GO
SET IDENTITY_INSERT [dbo].[Users] ON 

INSERT [dbo].[Users] ([Id], [Email], [PasswordHash], [Role], [CreatedAt]) VALUES (2, N'asjanhasa1@gmail.com', N'$2a$11$JTDlqiEh45.ZBDqCP.NLqOkt.mcl3rNadVO.RX71vG4F0akZwoQtS', N'Admin', CAST(N'2025-06-03T10:57:48.797' AS DateTime))
INSERT [dbo].[Users] ([Id], [Email], [PasswordHash], [Role], [CreatedAt]) VALUES (3, N'asjanhasa2@gmail.com', N'$2a$11$pkusQT2aHn8ow.YVnlFi/up3xI4jK41Vo3FYr4aTaahN3OdroA27a', N'User', CAST(N'2025-06-03T15:53:53.313' AS DateTime))
INSERT [dbo].[Users] ([Id], [Email], [PasswordHash], [Role], [CreatedAt]) VALUES (5, N'asjanhasa@gmail.com', N'$2a$11$Vc2CTJcNXP8I7MJpT9.hDu89h1DeSHpztPFfjNBoTKWhhLNcLBl1.', N'User', CAST(N'2025-06-04T17:55:55.260' AS DateTime))
INSERT [dbo].[Users] ([Id], [Email], [PasswordHash], [Role], [CreatedAt]) VALUES (6, N'asjanhasa3@gmail.com', N'$2a$11$VkN.fbUXO553r4GMSi2wmuy3E546s9ATCeUIFAw/6FhQBkYFbDSPa', N'User', CAST(N'2025-06-04T17:57:18.133' AS DateTime))
INSERT [dbo].[Users] ([Id], [Email], [PasswordHash], [Role], [CreatedAt]) VALUES (7, N'asjanhasa4@gmail.com', N'$2a$11$o4pcbJ8tapvXxDmmxXnd4uT9sXCXax1NbcazVaCamn7L0lpNnK.Ea', N'User', CAST(N'2025-06-04T17:57:25.420' AS DateTime))
INSERT [dbo].[Users] ([Id], [Email], [PasswordHash], [Role], [CreatedAt]) VALUES (8, N'asjanhasa5@gmail.com', N'$2a$11$LjwsLW4ZGTN./mvW9f7dDOKSH7d1jWkYie.YqQIbK2teZedHrY64S', N'User', CAST(N'2025-06-04T17:57:33.490' AS DateTime))
INSERT [dbo].[Users] ([Id], [Email], [PasswordHash], [Role], [CreatedAt]) VALUES (9, N'asjanhasa7@gmail.com', N'$2a$11$/cXBsMx.1IXcUsJkbLQiJO4/RANBgbEVb6hdeOVsXpuE.sJ1Vaxtm', N'User', CAST(N'2025-06-04T17:57:43.200' AS DateTime))
INSERT [dbo].[Users] ([Id], [Email], [PasswordHash], [Role], [CreatedAt]) VALUES (10, N'asjanhasa8@gmail.com', N'$2a$11$/tJOGp3J1WlHJOzJwODPnOCAIx7K8jfmdDWyaav.AyZceYjtjwCIO', N'User', CAST(N'2025-06-04T17:57:52.703' AS DateTime))
INSERT [dbo].[Users] ([Id], [Email], [PasswordHash], [Role], [CreatedAt]) VALUES (11, N'asjanhasa3asdas@gmail.com', N'$2a$11$cT2DWplLjfRucLqYzQ6lGuXC4PYqlTLYIPCWtUlUsgWZ1FGgDO/pi', N'User', CAST(N'2025-06-04T17:57:59.427' AS DateTime))
INSERT [dbo].[Users] ([Id], [Email], [PasswordHash], [Role], [CreatedAt]) VALUES (15, N'asjanhasa10@gmail.com', N'$2a$11$h6.Xd1OUl5d8aU5ozbURVOGBLTWQ18EaGNGzdsqcnkk.AIMmNqEla', N'User', CAST(N'2025-06-04T19:30:06.960' AS DateTime))
INSERT [dbo].[Users] ([Id], [Email], [PasswordHash], [Role], [CreatedAt]) VALUES (17, N'asjanhasa25@gmail.com', N'$2a$11$ZIrRabhIQPZrv9zYEtDuG.ATNXzSNVzmUhDHEFgattppZZ1u6rWMm', N'User', CAST(N'2025-06-04T20:04:39.210' AS DateTime))
SET IDENTITY_INSERT [dbo].[Users] OFF
GO
ALTER TABLE [dbo].[ConversionRates] ADD  CONSTRAINT [UQ_Conversion] UNIQUE NONCLUSTERED 
(
	[FromCurrencyId] ASC,
	[ToCurrencyId] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[Currencies] ADD UNIQUE NONCLUSTERED 
(
	[Code] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
SET ANSI_PADDING ON
GO
ALTER TABLE [dbo].[Users] ADD UNIQUE NONCLUSTERED 
(
	[Email] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, SORT_IN_TEMPDB = OFF, IGNORE_DUP_KEY = OFF, ONLINE = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON, OPTIMIZE_FOR_SEQUENTIAL_KEY = OFF) ON [PRIMARY]
GO
ALTER TABLE [dbo].[ConversionRates]  WITH CHECK ADD  CONSTRAINT [FK_Conversion_From] FOREIGN KEY([FromCurrencyId])
REFERENCES [dbo].[Currencies] ([Id])
GO
ALTER TABLE [dbo].[ConversionRates] CHECK CONSTRAINT [FK_Conversion_From]
GO
ALTER TABLE [dbo].[ConversionRates]  WITH CHECK ADD  CONSTRAINT [FK_Conversion_To] FOREIGN KEY([ToCurrencyId])
REFERENCES [dbo].[Currencies] ([Id])
GO
ALTER TABLE [dbo].[ConversionRates] CHECK CONSTRAINT [FK_Conversion_To]
GO
USE [master]
GO
ALTER DATABASE [CurrencyExchangeDb] SET  READ_WRITE 
GO
