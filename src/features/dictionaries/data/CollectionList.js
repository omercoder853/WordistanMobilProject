import Fruits from "@/shared/data/collections/fruits.json";
import Animals from "@/shared/data/collections/animals.json";
import Places from "@/shared/data/collections/places.json";

export const COLLECTION_LIST = [
    {
        id: "1",
        title: "fruitsCollectionTitle",
        data: Fruits,
        desc: "fruitsCollectionDesc"
    },
    {
        id: "2",
        title: "animalsCollectionTitle",
        data: Animals,
        desc: "animalsCollectionDesc"
    },
    {
        id: "3",
        title: "placesCollectionTitle",
        data: Places,
        desc: "placesCollectionDesc"
    }
];
