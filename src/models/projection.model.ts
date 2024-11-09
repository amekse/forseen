class ProjectionData {
    static #instance: ProjectionData;
    private constructor() {}

    public static get instance(): ProjectionData {
        if (!ProjectionData.#instance) {
            ProjectionData.#instance = new ProjectionData();
        }

        return ProjectionData.#instance;
    }

    
}

const projectionData = ProjectionData.instance;
export default projectionData;