import ExtendedModel from './ExtendedModel'

class GroupedModel extends ExtendedModel {
  private groupId: number;

  public getGroupId (): number {
    return this.groupId
  }

  public setGroupId (groupId: number): void {
    this.groupId = groupId
  }
}

export default GroupedModel
