export const formatTime = (time: string) => {
  return time
    .replace(/[^\d:：]/g, "") // 仅允许输入数字和冒号
    .replace(/：/g, ":") // 将中文冒号替换为英文冒号
    .replace(/::+/g, ":") // 将连续的冒号替换为一个冒号
    .replace(/^([^:]*:[^:]*:[^:]*):/, "$1")
    .replace(/(?<=:)(\d+)/g, (_, $1) => {
      const num = parseInt($1);
      return (num > 59 ? 59 : num).toString().padStart(2, "0"); // 将分钟和秒钟限制在0-59，并确保结果始终有两位数
    });
};
