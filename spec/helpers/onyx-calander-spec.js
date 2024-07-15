describe('Onyx Calandar', function() {

  it('gets the season', function() {
    expect(OnyxCalendar.getSeason(50)).to.equal('Spring')
    expect(OnyxCalendar.getSeason(120)).to.equal('Summer')
    expect(OnyxCalendar.getSeason(250)).to.equal('Autumn')
    expect(OnyxCalendar.getSeason(300)).to.equal('Winter')
  });

  it('gets day names', function() {
    expect(OnyxCalendar.getDayName(50)).to.equal('Day of the Laughing Knight');
    expect(OnyxCalendar.getDayName(69)).to.equal('Day of the Blushing Wolf');
    expect(OnyxCalendar.getDayName(120)).to.equal('Day of the Indefatigable Elf');
    expect(OnyxCalendar.getDayName(250)).to.equal('Day of the Bound Knight');
    expect(OnyxCalendar.getDayName(300)).to.equal('Day of the Spectral Centaur');
    expect(OnyxCalendar.getDayName(700)).to.equal('Day of the Shadowed Fairies');
    expect(OnyxCalendar.getDayName(91)).to.equal('Festival of The Nymphs');
    expect(OnyxCalendar.getDayName(365)).to.equal('Great Festival of Rebirth');
  });

  it('gets the time of day', function() {
    expect(OnyxCalendar.getTimeOfDay(24*OnyxCalendar.TicksPerHour)).to.equal('Midnight');
    expect(OnyxCalendar.getTimeOfDay(0*OnyxCalendar.TicksPerHour)).to.equal('Midnight');
    expect(OnyxCalendar.getTimeOfDay(2*OnyxCalendar.TicksPerHour)).to.equal('Late Night');
    expect(OnyxCalendar.getTimeOfDay(4*OnyxCalendar.TicksPerHour)).to.equal('The Witching Hour');
    expect(OnyxCalendar.getTimeOfDay(7*OnyxCalendar.TicksPerHour)).to.equal('Dawn');
    expect(OnyxCalendar.getTimeOfDay(10*OnyxCalendar.TicksPerHour)).to.equal('Morning');
    expect(OnyxCalendar.getTimeOfDay(12*OnyxCalendar.TicksPerHour)).to.equal('Noon');
    expect(OnyxCalendar.getTimeOfDay(14*OnyxCalendar.TicksPerHour)).to.equal('Afternoon');
    expect(OnyxCalendar.getTimeOfDay(18*OnyxCalendar.TicksPerHour)).to.equal('Sunset');
    expect(OnyxCalendar.getTimeOfDay(20*OnyxCalendar.TicksPerHour)).to.equal('Evening');
    expect(OnyxCalendar.getTimeOfDay(22*OnyxCalendar.TicksPerHour)).to.equal('Night');
  });

});
