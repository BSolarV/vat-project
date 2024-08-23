// =====================================
// General Models
// =====================================

export interface SelectOption {
	label: string;
	value: string;
}

// =====================================
// Report Models
// =====================================

export enum ServiceSectors {
	agriculture = 'serviceSector_agriculture',
	food = 'serviceSector_food',
	forestry = 'serviceSector_forestry',
	mining = 'serviceSector_mining',
	oil_and_gas_production = 'serviceSector_oil_and_gas_production',
	basic_metal_production = 'serviceSector_basic_metal_production',
	chemical_industries = 'serviceSector_chemical_industries',
	mechanical_and_electrical_engineering = 'serviceSector_mechanical_and_electrical_engineering',
	transport_equipment_manufacturing = 'serviceSector_transport_equipment_manufacturing',
	textiles = 'serviceSector_textiles',
	commerce = 'serviceSector_commerce',
	financial_services = 'serviceSector_financial_services',
	hotels = 'serviceSector_hotels',
	media = 'serviceSector_media',
	postal_and_telecommunications_services = 'serviceSector_postal_and_telecommunications_services',
	construction = 'serviceSector_construction',
	education = 'serviceSector_education',
	health_services = 'serviceSector_health_services',
	public_service = 'serviceSector_public_service',
	utilities = 'serviceSector_utilities',
	shipping = 'serviceSector_shipping',
	transport = 'serviceSector_transport',
	other = 'serviceSector_other',
}

export interface Client {
	name: string;
	serviceSector: ServiceSectors;
}

export interface ClientsCollection {
	[id: string]: Client;
}

export enum Enviroments {
	enviroment_production = 'enviroment_production',
	enviroment_preProduction = 'enviroment_preProduction',
	enviroment_development = 'enviroment_development',
}

export enum Typologies {
	typology_blackBox = 'typology_blackBox',
	typology_grayBox = 'typology_grayBox',
	typology_whiteBox = 'typology_whiteBox',
}

export enum PentestTypes {
	pentestType_web = 'pentestType_web',
	pentestType_mobile = 'pentestType_mobile',
	pentestType_OS = 'pentestType_OS',
	pentestType_DB = 'pentestType_DB',
	pentestType_redTeam = 'pentestType_redTeam',
	pentestType_blueTeam = 'pentestType_blueTeam',
	pentestType_purpleTeam = 'pentestType_purpleTeam',
	pentestType_other = 'pentestType_other',
}

export interface ReportUser {
	username: string;
	userRole?: string;
	comment?: string;
}

export interface ReportScope {
	client: string;
	appName: string;
	pentestType: PentestTypes;
	URL: string;
	beginDate: string;
	endDate: string;
	enviroment: Enviroments;
	typology: Typologies;
	users: ReportUser[];
	observations: string;
}

// =====================================
// Vulnerabilities Models
// =====================================

export enum VulnerabilityFields {
	VulnerabilityField_name = 'VulnerabilityField_name',
	VulnerabilityField_criticity = 'VulnerabilityField_criticity',
	VulnerabilityField_cvssVector = 'VulnerabilityField_cvssVector',
	VulnerabilityField_metricImpact = 'VulnerabilityField_metricImpact',
	VulnerabilityField_metricExlpotability = 'VulnerabilityField_metricExlpotability',
	VulnerabilityField_description = 'VulnerabilityField_description',
	VulnerabilityField_impact = 'VulnerabilityField_impact',
	VulnerabilityField_reference = 'VulnerabilityField_reference',
	VulnerabilityField_recommendations = 'VulnerabilityField_recommendations',
	VulnerabilityField_CVEs = 'VulnerabilityField_CVEs',
}

export enum VulnerabilityExtraFields {
	VulnerabilityDetailedField_URL = 'VulnerabilityDetailedField_URL',
	VulnerabilityDetailedField_evidence = 'VulnerabilityDetailedField_evidence',
}

export type VulnerabilityDetailedFields =
	| VulnerabilityFields
	| VulnerabilityExtraFields;

// VulnerabilityMapper auxiliar
export interface VulnerabilityCardMapper {
	[row: number]: {
		[col: number]: VulnerabilityDetailedFields | undefined;
	};
}

export enum Criticities {
	Criticity_Critical = 'Criticity_Critical',
	Criticity_High = 'Criticity_High',
	Criticity_Medium = 'Criticity_Medium',
	Criticity_Low = 'Criticity_Low',
	Criticity_Informative = 'Criticity_Informative',
}

export enum MetricsImpact {
	MetricImpact_Critical = 'MetricImpact_Critical',
	MetricImpact_High = 'MetricImpact_High',
	MetricImpact_Medium = 'MetricImpact_Medium',
	MetricImpact_Low = 'MetricImpact_Low',
}

export enum MetricsExplotability {
	MetricExplotability_Level_4 = 'MetricExplotability_Level_4',
	MetricExplotability_Level_3 = 'MetricExplotability_Level_3',
	MetricExplotability_Level_2 = 'MetricExplotability_Level_2',
	MetricExplotability_Level_1 = 'MetricExplotability_Level_1',
}

export interface Vulnerability {
	[VulnerabilityFields.VulnerabilityField_name]: string;
	[VulnerabilityFields.VulnerabilityField_criticity]: Criticities;
	[VulnerabilityFields.VulnerabilityField_cvssVector]: string;
	[VulnerabilityFields.VulnerabilityField_metricImpact]: MetricsImpact;
	[VulnerabilityFields.VulnerabilityField_metricExlpotability]: MetricsExplotability;
	[VulnerabilityFields.VulnerabilityField_description]: string;
	[VulnerabilityFields.VulnerabilityField_impact]: string;
	[VulnerabilityFields.VulnerabilityField_reference]: string;
	[VulnerabilityFields.VulnerabilityField_recommendations]: string;
	[VulnerabilityFields.VulnerabilityField_CVEs]: string;
}

export enum VulnerabilityEvidenceTypes {
	VulnerabilityEvidenceType_Image = 'EvidenceType_Image',
	VulnerabilityEvidenceType_Text = 'EvidenceType_Text',
}

export interface VulnerabilityEvidence {
	type: VulnerabilityEvidenceTypes;
	content: string;
}

export interface VulnerabilityDetails {
	VulnerabilityDetailedField_URL: string;
	VulnerabilityDetailedField_evidence: VulnerabilityEvidence[];
}
