import LC from 'leanengine';
import fs from 'fs';
import readline from 'readline';

const fileStream = fs.createReadStream('TDS.csv');
const rl = readline.createInterface({
  input: fileStream,
  crlfDelay: Infinity,
});
for await (const line of rl) {
  const [managerEmail, employeeEmail] = line.split(',').map((s) => s.trim());
  const query = new LC.Query(LC.User);
  query.equalTo('email', employeeEmail);
  const employee = await query.first({ useMasterKey: true });
  if (employee && !employee.get('manager')) {
    const query = new LC.Query(LC.User);
    query.equalTo('email', managerEmail);
    let manager = await query.first({ useMasterKey: true });
    if (manager) {
      console.log(
        `setting report relation ${employeeEmail} => ${managerEmail}`,
      );
      employee.set('manager', manager);
      await employee.save(null, { useMasterKey: true });
    }
  }
}
