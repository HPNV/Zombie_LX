export default interface Activity{
    /**
     * @param timeInMilliSeconds
     * @return Boolean that indicate if the function is finish
     */
    updateActivity(timeInMilliSeconds: number): boolean;

}