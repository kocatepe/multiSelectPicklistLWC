public with sharing class LWCUtility {
    @AuraEnabled
    public static List<Enums_RelationshipType__mdt> getRelationshipTypesFromMetadata() {
        return [SELECT DeveloperName, Label FROM Enums_RelationshipType__mdt];
    }
}